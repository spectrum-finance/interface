import { Button, Flex, Form, Modal, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { first } from 'rxjs';

import { TxId } from '../../../../common/types';
import { CurrencyPreview } from '../../../../components/CurrencyPreview/CurrencyPreview';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { ergoPaySwap } from '../../operations/swap/ergopaySwap';
import { SwapConfirmationInfo } from '../SwapConfirmationModal/SwapConfirmationInfo/SwapConfirmationInfo';

export interface ErgoPayOpenWalletContentProps {
  readonly value: Required<SwapFormModel>;
  readonly onTxRegister: (p: TxId) => void;
}

export const SwapOpenWallet: FC<ErgoPayOpenWalletContentProps> = ({
  value,
  onTxRegister,
}) => {
  const form = useForm<SwapFormModel>(value);
  const [loading, setLoading] = useState<boolean>(false);

  const swapOperation = async () => {
    if (value.pool && value.fromAmount && value.toAmount) {
      setLoading(true);
      ergoPaySwap(value.pool as any, value.fromAmount, value.toAmount)
        .pipe(first())
        .subscribe({
          next: (txId) => {
            setLoading(false);
            onTxRegister(txId);
          },
          error: () => setLoading(false),
        });
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
              <SwapConfirmationInfo value={value} />
            </Flex.Item>
            <Flex.Item>
              <Button
                size="extra-large"
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                {isMobile ? t`Open Wallet` : t`Proceed`}
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
