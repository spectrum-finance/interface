import { Address } from '@ergolabs/ergo-sdk';
import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Form,
  Menu,
  Modal,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';
import { first } from 'rxjs';

import { TxId } from '../../../../common/types';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { getShortAddress } from '../../../../utils/string/addres';
import { ergopayRefund } from '../../operations/refund/ergopayRefund';
import { useSettings } from '../../settings/settings';
import { RefundConfirmationInfo } from '../RefundConfirmationModal/RefundConfirmationInfo/RefundConfirmationInfo';

export interface RefundOpenWalletProps {
  readonly addresses: Address[];
  readonly txId: TxId;
  readonly onTxRegister: (p: TxId) => void;
}

export const RefundOpenWallet: FC<RefundOpenWalletProps> = ({
  addresses,
  txId,
  onTxRegister,
}) => {
  const form = useForm({});
  const [{ address }] = useSettings();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState(address);

  const handleRefund = () => {
    if (activeAddress) {
      ergopayRefund(activeAddress, txId)
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
        <Trans>Refund confirmation</Trans>
      </Modal.Title>
      <Modal.Content width={570}>
        <Form onSubmit={handleRefund} form={form}>
          <Flex col>
            <Flex.Item marginBottom={6}>
              <RefundConfirmationInfo />
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex direction="col">
                <Flex.Item marginBottom={2}>
                  <Typography.Body strong>
                    <Trans>Select address</Trans>
                  </Typography.Body>
                  <InfoTooltip
                    placement="rightBottom"
                    content={t`Refund will be performed to this address`}
                  />
                </Flex.Item>
                <Flex.Item>
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu style={{ overflowY: 'auto', maxHeight: '200px' }}>
                        {addresses.map((a) => (
                          <Menu.Item
                            key={a}
                            onClick={() => setActiveAddress(a)}
                          >
                            {a}
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <Button size="large" style={{ width: '100%' }}>
                      {getShortAddress(activeAddress ?? '')}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Button
                htmlType="submit"
                size="large"
                loading={loading}
                type="primary"
                block
              >
                {t`Proceed`}
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};
