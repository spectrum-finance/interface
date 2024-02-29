import { Button, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { combineLatest, first, switchMap } from 'rxjs';

import { AssetLock } from '../../../../common/models/AssetLock.ts';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection.tsx';
import { useSettings } from '../../../../gateway/settings/settings.ts';
import { networkContext$ } from '../../../../network/cardano/api/networkContext/networkContext.ts';
import { ammTxFeeMapping } from '../../../../network/cardano/api/operations/common/ammTxFeeMapping.ts';
import { submitTx } from '../../../../network/cardano/api/operations/common/submitTxCandidate.ts';
import { transactionBuilder$ } from '../../../../network/cardano/api/operations/common/transactionBuilder.ts';
import { CardanoSettings } from '../../../../network/cardano/settings/settings.ts';

interface WithdrawalLiquidityConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  lock: AssetLock;
}

const WithdrawalLiquidityConfirmationModal: FC<WithdrawalLiquidityConfirmationModalProps> =
  ({ onClose, lock }): JSX.Element => {
    const { address } = useSettings() as CardanoSettings;

    const withdrawalOperation = async () => {
      onClose(
        combineLatest([networkContext$.pipe(first()), transactionBuilder$])
          .pipe(
            switchMap(([nc, tb]) => {
              return tb.unlock({
                redeemer: lock.redeemer,
                changeAddress: address!,
                collateralAmount: 4000000n,
                slotNo: nc.slotNo,
                txFees: ammTxFeeMapping,
                boxId: lock.boxId,
              });
            }),
          )
          .pipe(switchMap((data) => submitTx(data[0]!, true)))
          .toPromise(),
      );

      // onClose(actions.withdrawTokens(params, ctx).then((tx) => );
    };

    return (
      <>
        <Modal.Title>
          <Trans>Confirm withdrawal</Trans>
        </Modal.Title>
        <Modal.Content width={480}>
          <Flex col>
            <Flex.Item marginBottom={4}>
              <FormPairSection
                title={t`Assets to lock`}
                xAmount={lock.x}
                yAmount={lock.y}
              >
                <Flex.Item marginBottom={2} />
                <Flex.Item>
                  <Flex justify="space-between" align="center">
                    <Flex.Item>
                      <Flex align="center">
                        <Flex.Item>
                          <Typography.Body strong>
                            <Trans>Unlock date</Trans>
                          </Typography.Body>
                        </Flex.Item>
                      </Flex>
                    </Flex.Item>
                    <Flex.Item>
                      <Flex>
                        <Typography.Body strong>
                          {lock.unlockDate.toLocaleString(DateTime.DATE_FULL)}
                        </Typography.Body>
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </FormPairSection>
            </Flex.Item>
            <Button
              block
              size="large"
              type="primary"
              onClick={withdrawalOperation}
            >
              <Trans>Confirm Withdrawal</Trans>
            </Button>
          </Flex>
        </Modal.Content>
      </>
    );
  };

export { WithdrawalLiquidityConfirmationModal };
