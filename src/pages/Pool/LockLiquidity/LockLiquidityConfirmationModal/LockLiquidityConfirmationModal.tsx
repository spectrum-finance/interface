import {
  LockParams,
  millisToBlocks,
  minValueForOrder,
  mkLockActions,
  mkLockParser,
} from '@ergolabs/ergo-dex-sdk';
import {
  BoxSelection,
  DefaultBoxSelector,
  RustModule,
  TransactionContext,
} from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';
import React, { useState } from 'react';

import { ERG_DECIMALS, UI_FEE } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Button, Checkbox, Flex, Modal } from '../../../../ergodex-cdk';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { explorer } from '../../../../services/explorer';
import {
  useMinExFee,
  useMinTotalFees,
  utxos$,
} from '../../../../services/new/core';
import { submitTx } from '../../../../services/yoroi';
import yoroiProver from '../../../../services/yoroi/prover';
import { makeTarget } from '../../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../../utils/math';
import { getLockingPeriodString } from '../utils';

interface LockLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  pool: AmmPool;
  xAsset: Currency;
  yAsset: Currency;
  lpAsset: Currency;
  timelock: DateTime;
  percent: number;
}

const LockLiquidityConfirmationModal: React.FC<LockLiquidityConfirmationModalProps> =
  ({ onClose, xAsset, yAsset, lpAsset, timelock, percent, pool }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const now = DateTime.now().toMillis();

    const [utxos] = useObservable(utxos$);
    const [{ minerFee, address, pk }] = useSettings();
    const minExFee = useMinExFee();
    const totalFees = useMinTotalFees();

    const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
    const exFeeNErg = minExFee.amount;
    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    const lpToLock = pool['pool'].lp.withAmount(lpAsset.amount);

    const handleCheck = () => setIsChecked((prev) => !prev);

    // TODO: add try catch
    const lockOperation = async () => {
      const parser = mkLockParser();

      // Possible issue: here (operation doesn't use uiFee and exFee)
      const minFeeForOrder = minValueForOrder(
        minerFeeNErgs,
        uiFeeNErg,
        exFeeNErg,
      );

      const target = makeTarget([lpToLock], minFeeForOrder);

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

      const deadline = millisToBlocks(BigInt(timelock.toMillis() - now)) + 1;

      if (address && pk) {
        const params: LockParams = {
          deadline,
          redeemer: pk,
        };

        const ctx: TransactionContext = {
          inputs,
          selfAddress: address,
          changeAddress: address,
          feeNErgs: minerFeeNErgs,
          network,
        };

        onClose(actions.lockTokens(params, ctx).then((tx) => submitTx(tx)));
      }
    };

    return (
      <>
        <Modal.Title>Confirm Lock Liquidity</Modal.Title>
        <Modal.Content width={436}>
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
                minExFee={minExFee}
                totalFees={totalFees}
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex>
                <Checkbox onChange={handleCheck}>
                  I understand that I&apos;m locking{' '}
                  <b>{lpAsset.toString({ suffix: false })}</b> LP-tokens, which
                  is <b>{percent}%</b> of my{' '}
                  <b>{`${xAsset.asset.name}/${yAsset.asset.name}`}</b> liquidity
                  position, for a period of{' '}
                  <b>{getLockingPeriodString(timelock)}</b> (until{' '}
                  {timelock.toLocaleString(DateTime.DATE_FULL)}) without the
                  ability to withdraw mine before the end of this period.
                </Checkbox>
              </Flex>
            </Flex.Item>
          </Flex>
          <Button
            block
            size="large"
            disabled={!isChecked}
            type="primary"
            onClick={lockOperation}
          >
            Lock Liquidity
          </Button>
        </Modal.Content>
      </>
    );
  };

export { LockLiquidityConfirmationModal };
