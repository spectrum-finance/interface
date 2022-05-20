import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { Observable } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { TxId } from '../../../common/types';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import {
  Alert,
  Button,
  Checkbox,
  Flex,
  Form,
  Modal,
  useForm,
} from '../../../ergodex-cdk';
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
      onClose(swap(value.pool, value.fromAmount, value.toAmount));
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
              <TokenControlFormItem
                readonly
                bordered
                noBottomInfo
                amountName="fromAmount"
                tokenName="fromAsset"
                label="From"
              />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <TokenControlFormItem
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
