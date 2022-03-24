import { Trans } from '@lingui/macro';
import { Typography } from 'antd';
import React from 'react';

import { addresses$ } from '../../../../api/addresses';
import { transactionsHistory$ } from '../../../../api/transactionsHistory';
import { useObservable } from '../../../../common/hooks/useObservable';
import { Box, Flex, Menu, Modal, Skeleton } from '../../../../ergodex-cdk';
import { isRefundableOperation } from '../../../../utils/ammOperations';
import { exploreTx } from '../../../../utils/redirect';
import {
  openConfirmationModal,
  Operation,
} from '../../../ConfirmationModal/ConfirmationModal';
import { DateTimeView } from '../../DateTimeView/DateTimeView';
import { OptionsButton } from '../../OptionsButton/OptionsButton';
import { InputOutputColumn } from '../InputOutputColumn/InputOutputColumn';
import { RefundConfirmationModal } from '../RefundConfirmationModal/RefundConfirmationModal';
import { TxStatusTag } from '../TxStatusTag/TxStatusTag';
import { TxTypeTag } from '../TxTypeTag/TxTypeTag';
import { Operation as DexOperation } from '../types';
import { normalizeOperations } from '../utils';

const TxHistoryModal = (): JSX.Element => {
  const [txs] = useObservable(transactionsHistory$);
  const [addresses] = useObservable(addresses$);

  const handleOpenRefundConfirmationModal = (operation: DexOperation) => {
    if (addresses) {
      openConfirmationModal(
        (next) => {
          return (
            <RefundConfirmationModal
              operation={operation}
              addresses={addresses}
              onClose={next}
            />
          );
        },
        Operation.REFUND,
        { xAsset: operation.assetX, yAsset: operation.assetY },
      );
    }
  };

  const renderTxActionsMenu = (op: DexOperation) => {
    return (
      <>
        <Menu.Item>
          <a
            onClick={() => exploreTx(op.txId)}
            target="_blank"
            rel="noreferrer"
          >
            <Trans>View on Explorer</Trans>
          </a>
        </Menu.Item>
        {isRefundableOperation(op.status) && (
          <Menu.Item onClick={() => handleOpenRefundConfirmationModal(op)}>
            <a rel="noreferrer">
              <Trans>Refund transaction</Trans>
            </a>
          </Menu.Item>
        )}
      </>
    );
  };

  return (
    <>
      <Modal.Title>
        <Trans>Recent transactions</Trans>
      </Modal.Title>
      <Modal.Content width={680}>
        <Flex col style={{ overflowY: 'auto', maxHeight: '500px' }}>
          <Flex.Item>
            <Flex justify="space-between" align="center">
              <Flex.Item style={{ width: '35%' }}>
                <Typography.Title level={5}>
                  <Trans>Assets</Trans>
                </Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '28%' }}>
                <Typography.Title level={5}>
                  <Trans>Date</Trans>
                </Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '20%' }}>
                <Typography.Title level={5}>
                  <Trans>Type</Trans>
                </Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '16%' }}>
                <Typography.Title level={5}>
                  <Trans>Status</Trans>
                </Typography.Title>
              </Flex.Item>
              <Flex.Item style={{ width: '5%' }} />
            </Flex>
          </Flex.Item>
          {txs ? (
            normalizeOperations(txs)
              .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
              .map((op, index) => {
                return (
                  <Flex.Item
                    key={index}
                    style={{
                      borderBottom:
                        '1px solid var(--ergo-default-border-color)',
                    }}
                  >
                    <Box transparent padding={[5, 0]} bordered={false}>
                      <Flex justify="space-between" align="center">
                        <Flex.Item style={{ width: '35%' }}>
                          <InputOutputColumn
                            type={op.type}
                            x={op.assetX}
                            y={op.assetY}
                          />
                        </Flex.Item>
                        <Flex.Item style={{ width: '28%' }}>
                          <DateTimeView value={op.timestamp} />
                          <br />
                          <DateTimeView type="time" value={op.timestamp} />
                        </Flex.Item>
                        <Flex.Item style={{ width: '20%' }}>
                          <TxTypeTag type={op.type} />
                        </Flex.Item>
                        <Flex.Item style={{ width: '16%' }}>
                          <TxStatusTag status={op.status} />
                        </Flex.Item>
                        <Flex.Item style={{ width: '5%' }}>
                          <OptionsButton placement="bottomLeft">
                            {renderTxActionsMenu(op)}
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
