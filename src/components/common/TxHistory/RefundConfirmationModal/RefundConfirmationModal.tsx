import { TxId } from '@ergolabs/ergo-sdk';
import React, { useState } from 'react';

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
import { useObservable } from '../../../../hooks/useObservable';
import { utxos$ } from '../../../../services/new/core';
import { submitTx } from '../../../../services/yoroi';
import { refund } from '../../../../utils/ammOperations';
import { getShortAddress } from '../../../../utils/string/addres';
import { InfoTooltip } from '../../../InfoTooltip/InfoTooltip';

interface RefundConfirmationModalProps {
  onClose: () => void;
  addresses: Address[];
  txId: TxId;
}

// TODO:ADD_REFUND_CONFIRMATION_MODAL[EDEX-481]
const RefundConfirmationModal: React.FC<RefundConfirmationModalProps> = ({
  onClose,
  addresses,
  txId,
}): JSX.Element => {
  const [utxos] = useObservable(utxos$);
  const [{ minerFee, address }] = useSettings();

  const [activeAddress, setActiveAddress] = useState(address);

  const handleRefund = async () => {
    if (utxos?.length && activeAddress) {
      try {
        const tx = await refund(utxos, {
          address: activeAddress,
          txId,
          minerFee: minerFee,
        });
        await submitTx(tx);
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
  };

  return (
    <>
      <Modal.Title>Refund transaction</Modal.Title>
      <Modal.Content width={570}>
        <Flex direction="col">
          <Flex.Item marginBottom={4}>
            <Flex direction="col">
              <Flex.Item marginBottom={2}>
                <Typography.Body strong>Fees</Typography.Body>
              </Flex.Item>
              <Flex.Item>
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
            </Flex>
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
                        <Menu.Item key={a} onClick={() => setActiveAddress(a)}>
                          {a}
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                >
                  <Button size="large">
                    {getShortAddress(activeAddress ?? '')}
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item>
            <Button size="large" type="primary" block onClick={handleRefund}>
              Refund
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { RefundConfirmationModal };
