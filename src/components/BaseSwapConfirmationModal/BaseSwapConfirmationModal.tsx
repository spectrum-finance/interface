import { Button, Flex, Form, Modal, useForm } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { fireOperationAnalyticsEvent } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { mapToSwapAnalyticsProps } from '../../utils/analytics/mapper';
import { CurrencyPreview } from '../CurrencyPreview/CurrencyPreview';

export interface BaseSwapConfirmationModalProps<T extends AmmPool> {
  readonly value: Required<SwapFormModel>;
  readonly onClose: (p: Observable<TxId>) => void;
  readonly Info: FC<{ value: Required<SwapFormModel<T>> }>;
  readonly swap: (pool: T, from: Currency, to: Currency) => Observable<TxId>;
}

export const BaseSwapConfirmationModal: FC<
  BaseSwapConfirmationModalProps<any>
> = ({ value, onClose, swap, Info }) => {
  const form = useForm<SwapFormModel>(value);

  const swapOperation = async () => {
    if (value.pool && value.fromAmount && value.toAmount) {
      fireOperationAnalyticsEvent('Swap Modal Confirm', (ctx) =>
        mapToSwapAnalyticsProps(value, ctx),
      );
      onClose(
        swap(value.pool, value.fromAmount, value.toAmount).pipe(
          tap(
            () => {
              fireOperationAnalyticsEvent('Swap Signed Success', (ctx) =>
                mapToSwapAnalyticsProps(value, ctx),
              );
            },
            (err) => {
              if (err.code === 2) {
                fireOperationAnalyticsEvent('Swap Cancel Sign', (ctx) =>
                  mapToSwapAnalyticsProps(value, ctx),
                );
                return;
              }
              fireOperationAnalyticsEvent(
                'Swap Modal Confirm Error',
                (ctx) => ({
                  ...mapToSwapAnalyticsProps(value, ctx),
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
        <Trans>Confirm swap</Trans>
      </Modal.Title>
      <Modal.Content width={496}>
        <Form form={form} onSubmit={swapOperation}>
          <Flex direction="col">
            <Flex.Item marginBottom={1}>
              <CurrencyPreview value={value.fromAmount} />
            </Flex.Item>
            <Flex.Item marginBottom={6}>
              <CurrencyPreview value={value.toAmount} />
            </Flex.Item>
            <Flex.Item marginBottom={6}>
              <Info value={value} />
            </Flex.Item>
            <Flex.Item>
              <Button size="extra-large" type="primary" htmlType="submit" block>
                <Trans>Confirm Swap</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
