import { Box, Button, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { Observable, tap } from 'rxjs';

import { panalytics } from '../../../common/analytics';
import { useObservable } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import { redeem } from '../../../gateway/api/operations/redeem';
import { redeemConfirmationInfo$ } from '../../../gateway/widgets/redeemConfirmationInfo';

// import { poolActions } from '../../../../services/poolActions';
interface ConfirmRemoveModalProps {
  onClose: (p: Observable<TxId>) => void;
  pool: AmmPool;
  lpAmount: Currency;
  xAmount: Currency;
  yAmount: Currency;
  percent: number;
}

export const RemoveLiquidityConfirmationModal: React.FC<ConfirmRemoveModalProps> =
  ({ pool, lpAmount, xAmount, yAmount, percent, onClose }) => {
    const [RedeemFees] = useObservable(redeemConfirmationInfo$);

    // TODO: add try catch
    const removeOperation = async (pool: AmmPool, lpAmount: Currency) => {
      if (pool && lpAmount) {
        const form = { xAmount, yAmount, lpAmount, percent };
        panalytics.confirmRedeem(form, pool);
        onClose(
          redeem(pool, lpAmount).pipe(
            tap(
              (txId) => panalytics.signedRedeem(form, pool, txId),
              (err) => panalytics.signedErrorRedeem(form, pool, err),
            ),
          ),
        );
      }
    };

    return (
      <>
        <Modal.Title>
          <Trans>Confirm Remove Liquidity</Trans>
        </Modal.Title>
        <Modal.Content width={436}>
          <Box transparent bordered={false}>
            <Flex direction="col">
              <Flex.Item marginBottom={6}>
                <FormPairSection
                  title={t`Pooled assets`}
                  xAmount={xAmount}
                  yAmount={yAmount}
                />
              </Flex.Item>
              <Flex.Item marginBottom={6}>
                <PageSection title={t`Fees`}>
                  {RedeemFees ? <RedeemFees /> : ''}
                </PageSection>
              </Flex.Item>
              <Flex.Item>
                <Button
                  block
                  type="primary"
                  size="large"
                  onClick={() => removeOperation(pool, lpAmount)}
                >
                  <Trans>Remove Liquidity</Trans>
                </Button>
              </Flex.Item>
            </Flex>
          </Box>
        </Modal.Content>
      </>
    );
  };
