import {
  LockParams,
  millisToBlocks,
  mkLockActions,
  mkLockParser,
} from '@ergolabs/ergo-dex-sdk';
import {
  BoxSelection,
  DefaultBoxSelector,
  MinBoxValue,
  RustModule,
  TransactionContext,
} from '@ergolabs/ergo-sdk';
import { Button, Checkbox, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import { useState } from 'react';
import * as React from 'react';

import { ERG_DECIMALS } from '../../../../common/constants/erg.ts';
import { useObservable } from '../../../../common/hooks/useObservable.ts';
import { AmmPool } from '../../../../common/models/AmmPool.ts';
import { Currency } from '../../../../common/models/Currency.ts';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection.tsx';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection.tsx';
import { useNetworkAsset } from '../../../../gateway/api/networkAsset.ts';
import { useSettings } from '../../../../gateway/settings/settings.ts';
import { utxos$ } from '../../../../network/ergo/api/utxos/utxos.ts';
import { ErgoSettings } from '../../../../network/ergo/settings/settings.ts';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler.ts';
import { explorer } from '../../../../services/explorer.ts';
import { submitTx } from '../../../../services/yoroi';
import yoroiProver from '../../../../services/yoroi/prover.ts';
import { makeTarget } from '../../../../utils/ammMath.ts';
import { parseUserInputToFractions } from '../../../../utils/math.ts';
import { getLockingPeriodString } from '../../../Liquidity/utils.ts';

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
    const [networkAsset] = useNetworkAsset();

    const now = DateTime.now().toMillis();

    const [utxos] = useObservable(utxos$);
    const { minerFee, address, pk } = useSettings() as ErgoSettings;

    // const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
    // const exFeeNErg = minExFee.amount;
    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    const lpToLock = pool['pool'].lp.withAmount(lpAsset.amount);

    const handleCheck = () => setIsChecked((prev) => !prev);

    // TODO: add try catch
    const lockOperation = async () => {
      const parser = mkLockParser();

      const minNErgForFee = minerFeeNErgs * 2n + MinBoxValue;

      const target = makeTarget([lpToLock as any], minNErgForFee);

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
        <Modal.Title>
          <Trans>Confirm Lock</Trans>
        </Modal.Title>
        <Modal.Content width={436}>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title={t`Assets to lock`}
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
            <Flex.Item marginBottom={4}>
              <Flex>
                <Checkbox onChange={handleCheck}>
                  <Trans>
                    I understand that I&apos;m locking{' '}
                    <b>{lpAsset.toString()}</b> LP-tokens, which is{' '}
                    <b>{percent}%</b> of my{' '}
                    <b>{`${xAsset.asset.name}/${yAsset.asset.name}`}</b>{' '}
                    liquidity position, for a period of{' '}
                    <b>{getLockingPeriodString(timelock)}</b> (until{' '}
                    {timelock.toLocaleString(DateTime.DATE_FULL)}) without the
                    ability to withdrawal before the end of this period.
                  </Trans>
                </Checkbox>
              </Flex>
            </Flex.Item>
          </Flex>
          <Button
            block
            size="extra-large"
            disabled={!isChecked}
            type="primary"
            onClick={lockOperation}
          >
            <Trans>Lock Liquidity</Trans>
          </Button>
        </Modal.Content>
      </>
    );
  };

export { LockLiquidityConfirmationModal };
