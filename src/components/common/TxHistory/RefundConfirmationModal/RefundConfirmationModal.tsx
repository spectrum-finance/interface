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

import { useObservable } from '../../../../common/hooks/useObservable';
import { TxSuccess } from '../../../../common/services/submitTx';
import { refund } from '../../../../gateway/api/operations/refund';
import { useSettings } from '../../../../gateway/settings/settings';
import { refundConfirmationInfo$ } from '../../../../gateway/widgets/refundConfirmationInfo';
import { getShortAddress } from '../../../../utils/string/addres';
import { InfoTooltip } from '../../../InfoTooltip/InfoTooltip';
import { Operation } from '../types';

interface RefundConfirmationModalProps {
  onClose: (p: Observable<TxSuccess>) => void;
  addresses: Address[];
  operation: Operation;
}

const RefundConfirmationModal: React.FC<RefundConfirmationModalProps> = ({
  onClose,
  addresses,
  operation,
}): JSX.Element => {
  const form = useForm({
    xAmount: operation.assetX,
    yAmount: operation.assetY,
    xAsset: operation.assetX.asset,
    yAsset: operation.assetY.asset,
  });
  const { address } = useSettings();
  const [RefundConfirmationInfo] = useObservable(refundConfirmationInfo$);
  const [activeAddress, setActiveAddress] = useState(address);

  const handleRefund = () => {
    if (activeAddress) {
      onClose(refund(activeAddress, operation.txId));
    }
  };

  return (
    <>
      <Modal.Title>
        <Trans>Refund confirmation</Trans>
      </Modal.Title>
      <Modal.Content width={570}>
        <Form onSubmit={() => {}} form={form}>
          <Flex col>
            <Flex.Item marginBottom={6}>
              {RefundConfirmationInfo && <RefundConfirmationInfo />}
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
                type="primary"
                block
                onClick={handleRefund}
              >
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
