import {
  millisToBlocks,
  mkLockActions,
  mkLockParser,
  RelockParams,
} from '@ergolabs/ergo-dex-sdk';
import {
  BoxSelection,
  DefaultBoxSelector,
  MinBoxValue,
  RustModule,
  TransactionContext,
} from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';
import React, { FC, useState } from 'react';

import { ERG_DECIMALS } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Button, Checkbox, Flex, Modal } from '../../../../ergodex-cdk';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { explorer } from '../../../../services/explorer';
import { useNetworkAsset, utxos$ } from '../../../../services/new/core';
import { submitTx } from '../../../../services/yoroi';
import yoroiProver from '../../../../services/yoroi/prover';
import { makeTarget } from '../../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../../utils/math';
import { getLockingPeriodString } from '../../utils';

interface RelockLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  pool: AmmPool;
  xAsset: Currency;
  yAsset: Currency;
  lpAsset: Currency;
  timelock: DateTime;
  percent: number;
}

const RelockLiquidityConfirmationModal: FC<RelockLiquidityConfirmationModalProps> =
  ({
    onClose,
    xAsset,
    yAsset,
    lpAsset,
    timelock,
    percent,
    pool,
  }): JSX.Element => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const networkAsset = useNetworkAsset();

    const now = DateTime.now().toMillis();

    const [utxos] = useObservable(utxos$);
    const [{ minerFee, address, pk }] = useSettings();

    // const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
    // const exFeeNErg = minExFee.amount;
    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    const lpToLock = pool['pool'].lp.withAmount(lpAsset.amount);

    const handleCheck = () => setIsChecked((prev) => !prev);

    const relockOperation = async () => {
      const parser = mkLockParser();

      const minNErgForFee = minerFeeNErgs * 2n + MinBoxValue;

      const target = makeTarget([lpToLock], minNErgForFee);

      const inputs = DefaultBoxSelector.select(utxos!, target) as BoxSelection;

      const network = await explorer.getNetworkContext();
      const RModule = await RustModule.load();

      const actions = mkLockActions(
        explorer,
        parser,
        yoroiProver,
        mainnetTxAssembler,
        RModule,
      );

      const deadline =
        network.height + millisToBlocks(BigInt(timelock.toMillis() - now)) + 1;

      if (address && pk) {
        const params: RelockParams = {
          // TODO: get box id
          boxId: '00',
          updateRedeemer: pk,
          updateDeadline: deadline,
        };

        const ctx: TransactionContext = {
          inputs,
          selfAddress: address,
          changeAddress: address,
          feeNErgs: minerFeeNErgs,
          network,
        };

        onClose(actions.relockTokens(params, ctx).then((tx) => submitTx(tx)));
      }
    };
    return (
      <>
        <Modal.Title>Confirm Relock</Modal.Title>
        <Modal.Content>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to lock"
                xAmount={xAsset}
                yAmount={yAsset}
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <FormFeesSection
                minerFee={minerFee}
                totalFees={new Currency(minerFeeNErgs, networkAsset)}
              />
            </Flex.Item>
            <Flex.Item>
              <Flex>
                <Checkbox onChange={handleCheck}>
                  I understand that I&apos;m locking{' '}
                  <b>{lpAsset.toString({ suffix: false })}</b> LP-tokens, which
                  is <b>{percent}%</b> of my{' '}
                  <b>{`${xAsset.asset.name}/${yAsset.asset.name}`}</b> liquidity
                  position, for a period of{' '}
                  <b>{getLockingPeriodString(timelock)}</b> (until{' '}
                  {timelock.toLocaleString(DateTime.DATE_FULL)}) without the
                  ability to withdraw before the end of this period.
                </Checkbox>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Button
                block
                size="large"
                disabled={!isChecked}
                type="primary"
                onClick={relockOperation}
              >
                Confirm Relock
              </Button>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </>
    );
  };

export { RelockLiquidityConfirmationModal };
