import Icon from '@ant-design/icons';
import { TxId } from '@ergolabs/ergo-sdk';
import { Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { ReactComponent as DotsVertical } from '../../../../assets/icons/icon-dots-vertical.svg';
import { useWalletAddresses, WalletAddressState } from '../../../../context';
import {
  Box,
  Button,
  Dropdown,
  Flex,
  Menu,
  Modal,
  Skeleton,
} from '../../../../ergodex-cdk';
import networkHistory from '../../../../services/networkHistory';
import { isRefundableOperation } from '../../../../utils/ammOperations';
import { exploreTx } from '../../../../utils/redirect';
import { InputOutputColumn } from '../InputOutputColumn/InputOutputColumn';
import { RefundConfirmationModal } from '../RefundConfirmationModal/RefundConfirmationModal';
import { TxStatusTag } from '../TxStatusTag/TxStatusTag';
import { TxTypeTag } from '../TxTypeTag/TxTypeTag';
import { Operation, OperationStatus } from '../types';
import { normalizeOperations } from '../utils';

const DotsIconVertical = () => <Icon component={DotsVertical} />;

const TxHistoryModal = (): JSX.Element => {
  const TXS_TO_DISPLAY = 50;

  const [operations, setOperations] = useState<Operation[] | undefined>();
  const walletAddresses = useWalletAddresses();

  useEffect(() => {
    if (walletAddresses.state === WalletAddressState.LOADED) {
      networkHistory
        .getAllByAddresses(walletAddresses.addresses, TXS_TO_DISPLAY)
        .then((ops) => setOperations(normalizeOperations(ops)));
    }
  }, [walletAddresses]);

  const handleOpenRefundConfirmationModal = useCallback(
    (txId) => {
      if (walletAddresses.state === WalletAddressState.LOADED) {
        return Modal.open(({ close }) => (
          <RefundConfirmationModal
            txId={txId}
            addresses={walletAddresses.addresses}
            onClose={close}
          />
        ));
      }
    },
    [walletAddresses],
  );

  const renderTxActionsMenu = (status: OperationStatus, txId: TxId) => {
    return (
      <Box padding={2}>
        <Menu.Item>
          <a onClick={() => exploreTx(txId)} target="_blank" rel="noreferrer">
            View on Explorer
          </a>
        </Menu.Item>
        {isRefundableOperation(status) && (
          <Menu.Item onClick={() => handleOpenRefundConfirmationModal(txId)}>
            <a rel="noreferrer">Refund transaction</a>
          </Menu.Item>
        )}
      </Box>
    );
  };

  return (
    <>
      <Modal.Title>Recent transactions</Modal.Title>
      <Modal.Content width={570}>
        <Flex
          flexDirection="col"
          style={{ overflowY: 'auto', maxHeight: '500px' }}
        >
          <Flex.Item>
            <Flex justify="space-between" alignItems="center">
              <Flex.Item style={{ width: '44%' }}>
                <Typography.Title level={5}>Input / Output</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '23%' }}>
                <Typography.Title level={5}>Type</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '23%' }}>
                <Typography.Title level={5}>Status</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '10%' }}>
                <Typography.Title level={5}>Action</Typography.Title>
              </Flex.Item>
            </Flex>
          </Flex.Item>
          {operations ? (
            operations.map((op, index) => {
              return (
                <Flex.Item
                  key={index}
                  style={{
                    borderBottom: '1px solid var(--ergo-default-border-color)',
                  }}
                >
                  <Box transparent padding={[5, 0]}>
                    <Flex justify="space-between" alignItems="center">
                      <Flex.Item style={{ width: '44%' }}>
                        <InputOutputColumn
                          type={op.type}
                          pair={{ x: op.assetX, y: op.assetY }}
                        />
                      </Flex.Item>
                      <Flex.Item style={{ width: '23%' }}>
                        <TxTypeTag type={op.type} />
                      </Flex.Item>
                      <Flex.Item style={{ width: '23%' }}>
                        <TxStatusTag status={op.status} />
                      </Flex.Item>
                      <Flex.Item style={{ width: '10%' }}>
                        <Dropdown
                          overlay={
                            <Menu style={{ width: 160, padding: 0 }}>
                              {renderTxActionsMenu(op.status, op.txId)}
                            </Menu>
                          }
                          trigger={['click']}
                          placement={'bottomLeft'}
                        >
                          <Button
                            type="text"
                            size="large"
                            icon={<DotsIconVertical />}
                          />
                        </Dropdown>
                      </Flex.Item>
                    </Flex>
                  </Box>
                </Flex.Item>
              );
            })
          ) : (
            <Skeleton active>
              {/*TODO:REPLACE_WITH_ORIGINAL_LOADING[EDEX-476]*/}
            </Skeleton>
          )}
        </Flex>
      </Modal.Content>
    </>
  );
};

export { TxHistoryModal };
