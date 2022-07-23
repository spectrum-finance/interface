import { Button, Flex, Form, Modal, useForm } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Observable, tap } from 'rxjs';

import { panalytics } from '../../../common/analytics';
import { useObservable } from '../../../common/hooks/useObservable';
import { TxSuccess } from '../../../common/services/submitTx';
import { AssetControlFormItem } from '../../../components/common/TokenControl/AssetControl';
import { swap } from '../../../gateway/api/operations/swap';
import { swapConfirmationInfo$ } from '../../../gateway/widgets/swapConfirmationInfo';
import { SwapFormModel } from '../SwapFormModel';

export interface SwapConfirmationModalProps {
  value: Required<SwapFormModel>;
  onClose: (p: Observable<TxSuccess>) => void;
}

export const SwapConfirmationModal: FC<SwapConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const [SwapConfirmationInfo] = useObservable(swapConfirmationInfo$);
  const form = useForm<SwapFormModel>(value);

  const swapOperation = async () => {
    if (value.pool && value.fromAmount && value.toAmount) {
      panalytics.confirmSwap(value);
      onClose(
        swap(value.pool, value.fromAmount, value.toAmount).pipe(
          tap(
            (txSuccess) => {
              panalytics.signedSwap(value, txSuccess.txId);
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
              <AssetControlFormItem
                readonly
                bordered
                noBottomInfo
                amountName="fromAmount"
                tokenName="fromAsset"
                label="From"
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <AssetControlFormItem
                readonly
                bordered
                noBottomInfo
                amountName="toAmount"
                tokenName="toAsset"
                label="To"
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              {SwapConfirmationInfo && <SwapConfirmationInfo value={value} />}
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
