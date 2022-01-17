import { TxId } from '@ergolabs/ergo-sdk';
import { Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { useWalletAddresses, WalletAddressState } from '../../../../context';
import { Box, Flex, Menu, Modal, Skeleton } from '../../../../ergodex-cdk';
import networkHistory from '../../../../services/networkHistory';
import { isRefundableOperation } from '../../../../utils/ammOperations';
import { exploreTx } from '../../../../utils/redirect';
import { OptionsButton } from '../../OptionsButton/OptionsButton';
import { InputOutputColumn } from '../InputOutputColumn/InputOutputColumn';
import { RefundConfirmationModal } from '../RefundConfirmationModal/RefundConfirmationModal';
import { TxStatusTag } from '../TxStatusTag/TxStatusTag';
import { TxTypeTag } from '../TxTypeTag/TxTypeTag';
import { Operation, OperationStatus } from '../types';
import { normalizeOperations } from '../utils';

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
      <>
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
      </>
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
                    <Flex justify="space-between" align="center">
                      <Flex.Item style={{ width: '35%' }}>
                        <InputOutputColumn
                          type={op.type}
                          pair={{ x: op.assetX, y: op.assetY }}
                        />
                      </Flex.Item>
                      <Flex.Item style={{ width: '28%' }}>
                        {op.timestamp}
                      </Flex.Item>
                      <Flex.Item style={{ width: '16%' }}>
                        <TxTypeTag type={op.type} />
                      </Flex.Item>
                      <Flex.Item style={{ width: '16%' }}>
                        <TxStatusTag status={op.status} />
                      </Flex.Item>
                      <Flex.Item style={{ width: '5%' }}>
                        <OptionsButton type="text" placement="bottomLeft">
                          {renderTxActionsMenu(op.status, op.txId)}
                        </OptionsButton>
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
