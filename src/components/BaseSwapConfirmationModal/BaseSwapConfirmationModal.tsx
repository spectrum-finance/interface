import { Button, Flex, Form, Modal, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { panalytics } from '../../common/analytics';
import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
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
      panalytics.confirmSwap(value);
      onClose(
        swap(value.pool, value.fromAmount, value.toAmount).pipe(
          tap(
            (txId) => {
              panalytics.signedSwap(value, txId);
            },
            (err) => {
              panalytics.signedErrorSwap(value, err);
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
              <CurrencyPreview value={value.fromAmount} label={t`From`} />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <CurrencyPreview value={value.toAmount} label={t`To`} />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
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
