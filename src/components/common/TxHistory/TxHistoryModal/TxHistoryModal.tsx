import {
  Box,
  Button,
  Flex,
  Menu,
  message,
  Modal,
  ReloadOutlined,
  Skeleton,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { useObservable } from '../../../../common/hooks/useObservable';
import { addresses$ } from '../../../../gateway/api/addresses';
import {
  isTransactionsHistorySyncing$,
  syncTransactionsHistory,
  transactionsHistory$,
} from '../../../../gateway/api/transactionsHistory';
import { exploreTx } from '../../../../gateway/utils/exploreAddress';
import { isRefundableOperation } from '../../../../utils/ammOperations';
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
import { TxHistoryEmptyState } from './TxHistoryEmptyState';

const TxHistoryModal = (): JSX.Element => {
  const [isSyncing] = useObservable(isTransactionsHistorySyncing$);
  const [txs, txsLoading] = useObservable(transactionsHistory$);
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

        <CopyToClipboard
          text={op.txId}
          onCopy={() => message.success(t`Copied to clipboard!`)}
        >
          <Menu.Item>
            <Trans>Copy transaction ID</Trans>
          </Menu.Item>
        </CopyToClipboard>
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
        <Flex align="center">
          <Flex.Item marginRight={4}>
            <Trans>Transaction history</Trans>
          </Flex.Item>
          <Flex.Item>
            <Button
              loading={isSyncing}
              onClick={syncTransactionsHistory}
              icon={<ReloadOutlined />}
            >
              {isSyncing ? t`Syncing...` : t`Sync`}
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Title>
      <Modal.Content width={680}>
        <Flex col style={{ overflowY: 'auto', maxHeight: '500px' }}>
          {!txsLoading ? (
            txs?.length ? (
              <>
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
                {normalizeOperations(txs)
                  .sort(
                    (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis(),
                  )
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
                              <Typography.Body>
                                <DateTimeView value={op.timestamp} />
                              </Typography.Body>
                              <br />
                              <Typography.Body>
                                <DateTimeView
                                  type="time"
                                  value={op.timestamp}
                                />
                              </Typography.Body>
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
                  })}
              </>
            ) : (
              <TxHistoryEmptyState />
            )
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
