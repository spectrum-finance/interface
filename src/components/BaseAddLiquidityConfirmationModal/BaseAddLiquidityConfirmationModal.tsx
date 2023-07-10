import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import { CANCEL_REQUEST } from '@ergolabs/ui-kit/dist/components/Modal/presets/Request';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { fireOperationAnalyticsEvent } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { PoolRatio } from '../../pages/PoolOverview/PoolRatio/PoolRatio';
import { mapToDepositAnalyticsProps } from '../../utils/analytics/mapper';
import { FormPairSection } from '../common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../Page/PageSection/PageSection';
import { Section } from '../Section/Section';

export interface BaseAddLiquidityConfirmationModal {
  value: Required<AddLiquidityFormModel>;
  onClose: (r: Observable<TxId>) => void;
  readonly Info: FC<{ value: Required<AddLiquidityFormModel> }>;
  readonly deposit: (
    pool: AmmPool,
    x: Currency,
    y: Currency,
  ) => Observable<TxId>;
}

export const BaseAddLiquidityConfirmationModal: FC<BaseAddLiquidityConfirmationModal> =
  ({ value, onClose, Info, deposit }) => {
    const addLiquidityOperation = async () => {
      const { pool, y, x } = value;

      if (pool && x && y) {
        fireOperationAnalyticsEvent('Deposit Modal Confirm', (ctx) =>
          mapToDepositAnalyticsProps(value, ctx),
        );
        onClose(
          deposit(
            pool,
            x.asset.id === pool.x.asset.id ? x : y,
            y.asset.id === pool.y.asset.id ? y : x,
          ).pipe(
            tap(
              () => {
                fireOperationAnalyticsEvent('Deposit Signed Success', (ctx) =>
                  mapToDepositAnalyticsProps(value, ctx),
                );
              },
              (err) => {
                if (err === CANCEL_REQUEST) {
                  fireOperationAnalyticsEvent('Deposit Cancel Sign', (ctx) =>
                    mapToDepositAnalyticsProps(value, ctx),
                  );
                  return;
                }

                fireOperationAnalyticsEvent(
                  'Deposit Modal Confirm Error',
                  (ctx) => ({
                    ...mapToDepositAnalyticsProps(value, ctx),
                    error_string: JSON.stringify(err),
                  }),
                );
              },
            ),
          ),
        );
      }
    };

    return (
      <>
        <Modal.Title>
          <Trans>Confirm Add Liquidity</Trans>
        </Modal.Title>
        <Modal.Content width={468}>
          <Flex direction="col">
            <Flex.Item marginBottom={6}>
              <FormPairSection
                title={t`Assets`}
                xAmount={value.x}
                yAmount={value.y}
              />
            </Flex.Item>
            <Flex.Item marginBottom={6}>
              <Section title={t`Current Ratio`} gap={2}>
                <Flex>
                  <Flex.Item flex={1} marginRight={2}>
                    <PoolRatio ammPool={value.pool} ratioOf="x" />
                  </Flex.Item>
                  <Flex.Item flex={1}>
                    <PoolRatio ammPool={value.pool} ratioOf="y" />
                  </Flex.Item>
                </Flex>
              </Section>
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
                size="extra-large"
                onClick={() => addLiquidityOperation()}
              >
                <Trans>Add Liquidity</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Modal.Content>
      </>
    );
  };
