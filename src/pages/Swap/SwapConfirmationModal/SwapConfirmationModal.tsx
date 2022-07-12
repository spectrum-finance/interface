import {
  Alert,
  Button,
  Checkbox,
  Flex,
  Form,
  Modal,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable, tap } from 'rxjs';

import { panalytics } from '../../../common/analytics';
import { useObservable } from '../../../common/hooks/useObservable';
import { TxId } from '../../../common/types';
import { AssetControlFormItem } from '../../../components/common/TokenControl/AssetControl';
import { swap } from '../../../gateway/api/operations/swap';
import { swapConfirmationInfo$ } from '../../../gateway/widgets/swapConfirmationInfo';
import { SwapFormModel } from '../SwapFormModel';

export interface SwapConfirmationModalProps {
  value: Required<SwapFormModel>;
  onClose: (p: Observable<TxId>) => void;
}

export const SwapConfirmationModal: FC<SwapConfirmationModalProps> = ({
  value,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    value.pool.verified,
  );
  const [SwapConfirmationInfo] = useObservable(swapConfirmationInfo$);
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
            {!value.pool.verified && (
              <>
                <Flex.Item marginBottom={4}>
                  <Alert
                    type="error"
                    message={t`This pair has not been verified by the ErgoDEX team`}
                    description={t`This operation may include fake or scam assets. Only confirm if you have done your own research.`}
                  />
                </Flex.Item>
                <Flex.Item marginBottom={4}>
                  <Checkbox onChange={() => setIsChecked((p) => !p)}>
                    <Trans>I understand the risks</Trans>
                  </Checkbox>
                </Flex.Item>
              </>
            )}
            <Flex.Item>
              <Button
                size="extra-large"
                type="primary"
                htmlType="submit"
                disabled={!isChecked}
                block
              >
                <Trans>Confirm Swap</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
