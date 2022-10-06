import { Button, Flex, Form, Modal, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Observable } from 'rxjs';

import { panalytics } from '../../../../../common/analytics';
import { TxId } from '../../../../../common/types';
import { Operation } from '../../../../../components/ConfirmationModal/ConfirmationModal';
import { CurrencyPreview } from '../../../../../components/CurrencyPreview/CurrencyPreview';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import { ergoPaySwap } from '../../../operations/swap';
import { SwapConfirmationInfo } from '../common/SwapConfirmationInfo/SwapConfirmationInfo';

export interface ErgoPaySwapConfirmationModalProps {
  readonly value: Required<SwapFormModel>;
  readonly onClose: (p: Observable<TxId>) => void;
}

export const ErgoPaySwapConfirmationModal: FC<ErgoPaySwapConfirmationModalProps> & {
  operation: Operation;
} = ({ value, onClose }) => {
  const form = useForm<SwapFormModel>(value);

  const swapOperation = async () => {
    if (value.pool && value.fromAmount && value.toAmount) {
      panalytics.confirmSwap(value);
      onClose(ergoPaySwap(value.pool as any, value.fromAmount, value.toAmount));
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
              <SwapConfirmationInfo value={value} />
            </Flex.Item>
            <Flex.Item>
              <Button size="extra-large" type="primary" htmlType="submit" block>
                <Trans>Open Wallet</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
ErgoPaySwapConfirmationModal.operation = Operation.ERGOPAY;
