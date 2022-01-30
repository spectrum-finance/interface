import Icon from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';

import { transactionsHistory$ } from '../../../../api/transactionsHistory';
import { ReactComponent as DotsVertical } from '../../../../assets/icons/icon-dots-vertical.svg';
import { useObservable } from '../../../../common/hooks/useObservable';
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
import { isRefundableOperation } from '../../../../utils/ammOperations';
import { exploreTx } from '../../../../utils/redirect';
import {
  openConfirmationModal,
  Operation,
} from '../../../ConfirmationModal/ConfirmationModal';
import { InputOutputColumn } from '../InputOutputColumn/InputOutputColumn';
import { RefundConfirmationModal } from '../RefundConfirmationModal/RefundConfirmationModal';
import { TxStatusTag } from '../TxStatusTag/TxStatusTag';
import { TxTypeTag } from '../TxTypeTag/TxTypeTag';
import { Operation as DexOperation } from '../types';
import { normalizeOperations } from '../utils';

const DotsIconVertical = () => <Icon component={DotsVertical} />;

const TxHistoryModal = (): JSX.Element => {
  const [txs] = useObservable(transactionsHistory$);
  const walletAddresses = useWalletAddresses();

  const handleOpenRefundConfirmationModal = (operation: DexOperation) => {
    if (walletAddresses.state === WalletAddressState.LOADED) {
      openConfirmationModal(
        (next) => {
          return (
            <RefundConfirmationModal
              operation={operation}
              addresses={walletAddresses.addresses}
              onClose={next}
            />
          );
        },
        Operation.REFUND,
        operation.assetX,
        operation.assetY,
      );
    }
  };

  const renderTxActionsMenu = (op: DexOperation) => {
    return (
      <Box padding={2}>
        <Menu.Item>
          <a
            onClick={() => exploreTx(op.txId)}
            target="_blank"
            rel="noreferrer"
          >
            View on Explorer
          </a>
        </Menu.Item>
        {isRefundableOperation(op.status) && (
          <Menu.Item onClick={() => handleOpenRefundConfirmationModal(op)}>
            <a rel="noreferrer">Refund transaction</a>
          </Menu.Item>
        )}
      </Box>
    );
  };

  return (
    <>
      <Modal.Title>Recent transactions</Modal.Title>
      <Modal.Content width={680}>
        <Flex col style={{ overflowY: 'auto', maxHeight: '500px' }}>
          <Flex.Item>
            <Flex justify="space-between" align="center">
              <Flex.Item style={{ width: '35%' }}>
                <Typography.Title level={5}>Assets</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '28%' }}>
                <Typography.Title level={5}>Date</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '16%' }}>
                <Typography.Title level={5}>Type</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '16%' }}>
                <Typography.Title level={5}>Status</Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '5%' }} />
            </Flex>
          </Flex.Item>
          {txs ? (
            normalizeOperations(txs).map((op, index) => {
              return (
                <Flex.Item
                  key={index}
                  style={{
                    borderBottom: '1px solid var(--ergo-default-border-color)',
                  }}
                >
                  <Box transparent padding={[5, 0]}>
                    <Flex justify="space-between" align="center">
                      <Flex.Item style={{ width: '35%' }}>
                        <InputOutputColumn
                          type={op.type}
                          x={op.assetX}
                          y={op.assetY}
                        />
                      </Flex.Item>
                      <Flex.Item style={{ width: '28%' }}>
                        {op.timestamp}
                      </Flex.Item>
                      <Flex.Item style={{ width: '20%' }}>
                        <TxTypeTag type={op.type} />
                      </Flex.Item>
                      <Flex.Item style={{ width: '16%' }}>
                        <TxStatusTag status={op.status} />
                      </Flex.Item>
                      <Flex.Item style={{ width: '5%' }}>
                        <Dropdown
                          overlay={
                            <Menu style={{ width: 160, padding: 0 }}>
                              {renderTxActionsMenu(op)}
                            </Menu>
                          }
                          trigger={['click']}
                          placement={'bottomLeft'}
                        >
                          <Button
                            type="text"
                            size="middle"
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
