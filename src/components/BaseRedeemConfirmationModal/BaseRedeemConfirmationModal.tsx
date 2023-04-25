import { Box, Button, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { fireOperationAnalyticsEvent } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { RemoveLiquidityFormModel } from '../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { mapToRedeemAnalyticsProps } from '../../utils/analytics/mapper';
import { FormPairSection } from '../common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../Page/PageSection/PageSection';

export interface BaseRedeemConfirmationModalProps {
  readonly pool: AmmPool;
  readonly value: Required<RemoveLiquidityFormModel>;
  readonly onClose: (r: Observable<TxId>) => void;
  readonly Info: FC<{ value: Required<RemoveLiquidityFormModel> }>;
  readonly redeem: (
    pool: AmmPool,
    lp: Currency,
    x: Currency,
    y: Currency,
  ) => Observable<TxId>;
}

export const BaseRedeemConfirmationModal: FC<BaseRedeemConfirmationModalProps> =
  ({ value, onClose, Info, redeem, pool }) => {
    const removeOperation = async () => {
      fireOperationAnalyticsEvent('Redeem Modal Confirm', (ctx) =>
        mapToRedeemAnalyticsProps(value, pool, ctx),
      );
      onClose(
        redeem(pool, value.lpAmount, value.xAmount, value.yAmount).pipe(
          tap(
            () => {
              fireOperationAnalyticsEvent('Redeem Sign Success', (ctx) =>
                mapToRedeemAnalyticsProps(value, pool, ctx),
              );
            },
            (err) => {
              if (err.code === 2) {
                fireOperationAnalyticsEvent('Redeem Cancel Sign', (ctx) =>
                  mapToRedeemAnalyticsProps(value, pool, ctx),
                );
                return;
              }

              fireOperationAnalyticsEvent(
                'Redeem Modal Confirm Error',
                (ctx) => ({
                  ...mapToRedeemAnalyticsProps(value, pool, ctx),
                  error_string: JSON.stringify(err),
                }),
              );
            },
          ),
        ),
      );
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
                  xAmount={value.xAmount}
                  yAmount={value.yAmount}
                />
              </Flex.Item>
              <Flex.Item marginBottom={6}>
                <PageSection title={t`Fees`}>
                  <Info value={value} />
                </PageSection>
              </Flex.Item>
              <Flex.Item>
                <Button
                  block
                  type="primary"
                  size="large"
                  onClick={() => removeOperation()}
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
