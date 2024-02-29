import { Button, Checkbox, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { AssetAmount } from '@spectrumlabs/cardano-dex-sdk';
import { DateTime } from 'luxon';
import * as React from 'react';
import { useState } from 'react';
import { switchMap } from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool.ts';
import { Currency } from '../../../../common/models/Currency.ts';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection.tsx';
import { FeesView } from '../../../../components/FeesView/FeesView.tsx';
import { useNetworkAsset } from '../../../../gateway/api/networkAsset.ts';
import { useSettings } from '../../../../gateway/settings/settings.ts';
import { ammTxFeeMapping } from '../../../../network/cardano/api/operations/common/ammTxFeeMapping.ts';
import { submitTx } from '../../../../network/cardano/api/operations/common/submitTxCandidate.ts';
import { transactionBuilder$ } from '../../../../network/cardano/api/operations/common/transactionBuilder.ts';
import { CardanoSettings } from '../../../../network/cardano/settings/settings.ts';
import { getLockingPeriodString } from '../../../Liquidity/utils.ts';

interface LockLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  pool: AmmPool;
  xAsset: Currency;
  yAsset: Currency;
  lpAsset: Currency;
  timelock: DateTime;
  percent: number;
  txFee: Currency;
}

const LockLiquidityConfirmationModal: React.FC<LockLiquidityConfirmationModalProps> =
  ({ onClose, xAsset, yAsset, lpAsset, timelock, percent, txFee }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const { address, ph } = useSettings() as CardanoSettings;
    const [networkAsset] = useNetworkAsset();

    const handleCheck = () => setIsChecked((prev) => !prev);

    const lockOperation = async () => {
      onClose(
        transactionBuilder$
          .pipe(
            switchMap((tb) =>
              tb.lock({
                lq: new AssetAmount(lpAsset.asset.data, lpAsset.amount),
                changeAddress: address!,
                pk: ph!,
                txFees: ammTxFeeMapping,
                lockedUntil: timelock.toMillis(),
              }),
            ),
            switchMap(([tx]) => submitTx(tx!)),
          )
          .toPromise(),
      );
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
              <FeesView
                refundableDeposit={new Currency(0n, networkAsset)}
                feeItems={[{ caption: t`Network Fee`, fee: txFee }]}
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
