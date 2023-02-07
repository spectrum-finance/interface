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
import React, { useState } from 'react';
import { Observable } from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { Operation } from '../../../../common/models/Operation';
import { TxId } from '../../../../common/types';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { getShortAddress } from '../../../../utils/string/addres';
import { walletRefund } from '../../operations/refund/walletRefund';
import { useSettings } from '../../settings/settings';
import { RefundConfirmationInfo } from './RefundConfirmationInfo/RefundConfirmationInfo';

interface RefundConfirmationModalProps {
  onClose: (p: Observable<TxId>) => void;
  addresses: Address[];
  operation: Operation;
}

interface RefundFormModal {
  readonly xAmount: Currency;
  readonly yAmount: Currency;
  readonly xAsset: AssetInfo;
  readonly yAsset: AssetInfo;
}

const getForValueFromOperation = (operation: Operation): RefundFormModal =>
  operation.type === 'swap'
    ? {
        xAmount: operation.base,
        xAsset: operation.base.asset,
        yAmount: operation.quote,
        yAsset: operation.quote.asset,
      }
    : {
        xAmount: operation.x,
        xAsset: operation.x.asset,
        yAmount: operation.y,
        yAsset: operation.y.asset,
      };

const RefundConfirmationModal: React.FC<RefundConfirmationModalProps> = ({
  onClose,
  addresses,
  operation,
}): JSX.Element => {
  const form = useForm<RefundFormModal>(getForValueFromOperation(operation));
  const [{ address }] = useSettings();
  const [activeAddress, setActiveAddress] = useState(address);

  const handleRefund = () => {
    if (activeAddress) {
      onClose(walletRefund(activeAddress, operation.txId));
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
              <Button htmlType="submit" size="large" type="primary" block>
                <Trans>Confirm</Trans>
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};

export { RefundConfirmationModal };
