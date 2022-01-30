import React, { useState } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { Address, useSettings } from '../../../../context';
import {
  Box,
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Modal,
  Typography,
} from '../../../../ergodex-cdk';
import { Form, useForm } from '../../../../ergodex-cdk/components/Form/NewForm';
import { utxos$ } from '../../../../services/new/core';
import { submitTx } from '../../../../services/yoroi';
import { refund } from '../../../../utils/ammOperations';
import { getShortAddress } from '../../../../utils/string/addres';
import { InfoTooltip } from '../../../InfoTooltip/InfoTooltip';
import { Operation } from '../types';

interface RefundConfirmationModalProps {
  onClose: (p: Promise<any>) => void;
  addresses: Address[];
  operation: Operation;
}

// TODO:ADD_REFUND_CONFIRMATION_MODAL[EDEX-481]
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
  const [utxos] = useObservable(utxos$);
  const [{ minerFee, address }] = useSettings();

  const [activeAddress, setActiveAddress] = useState(address);

  const handleRefund = () => {
    if (utxos?.length && activeAddress) {
      onClose(
        refund(utxos, {
          address: activeAddress,
          txId: operation.txId,
          minerFee: minerFee,
        }).then((tx) => submitTx(tx)),
      );
    }
  };

  return (
    <>
      <Modal.Title>Refund confirmation</Modal.Title>
      <Modal.Content width={570}>
        <Form onSubmit={() => {}} form={form}>
          <Flex col>
            <Flex.Item marginBottom={6}>
              <Box contrast padding={4}>
                <Flex justify="space-between">
                  <Flex.Item>
                    <Typography.Text strong>Fees</Typography.Text>
                    <InfoTooltip
                      placement="rightBottom"
                      content={
                        <Flex direction="col" style={{ width: '200px' }}>
                          <Flex.Item>
                            <Flex justify="space-between">
                              <Flex.Item>Miner Fee:</Flex.Item>
                              <Flex.Item>{minerFee} ERG</Flex.Item>
                            </Flex>
                          </Flex.Item>
                        </Flex>
                      }
                    />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Text strong>{minerFee} ERG</Typography.Text>
                  </Flex.Item>
                </Flex>
              </Box>
            </Flex.Item>
            <Flex.Item marginBottom={4}>
              <Flex direction="col">
                <Flex.Item marginBottom={2}>
                  <Typography.Body strong>Select address</Typography.Body>
                  <InfoTooltip
                    placement="rightBottom"
                    content="You will receive refund to this address"
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
                Confirm
              </Button>
            </Flex.Item>
          </Flex>
        </Form>
      </Modal.Content>
    </>
  );
};

export { RefundConfirmationModal };
