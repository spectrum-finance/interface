import React, { useState } from 'react';
import {
  Loading,
  Table,
  Text,
  Button,
  Container,
  Col,
  Spacer,
  Tooltip,
} from '@geist-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AmmDexOperation, AmmOrder, RefundOperation } from 'ergo-dex-sdk';
import { toast } from 'react-toastify';
import { exploreTx } from '../../utils/redirect';
import { isRefundableOperation } from '../../utils/ammOperations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useToggle } from '../../hooks/useToggle';
import { RefundConfirmationModal } from '../RefundConfirmationModal/RefundConfirmationModal';
import { truncate } from '../../utils/string';
import capitalize from 'lodash/capitalize';
import { renderEntrySignature } from '../../utils/history';

function renderOrder(
  order: AmmOrder,
  open: boolean,
  handleOpen: (txId: string) => void,
) {
  return {
    status: order.status,
    txId: (
      <CopyToClipboard text={order.txId} onCopy={() => toast.info('Copied')}>
        <span style={{ cursor: 'pointer' }}>{truncate(order.txId)}</span>
      </CopyToClipboard>
    ),
    operation: (
      <Container>
        <Col>
          <Tooltip text={'View on Explorer'} type="dark">
            <Button
              icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
              auto
              size="small"
              onClick={() => exploreTx(order.txId)}
            />
          </Tooltip>
        </Col>
        {isRefundableOperation(order.status) && (
          <>
            <Spacer x={0.2} />
            <Col>
              <Tooltip text={'Refund transaction'} type="dark">
                <Button
                  auto
                  size="small"
                  onClick={() => handleOpen(order.txId)}
                  icon={<FontAwesomeIcon icon={faUndo} />}
                />
              </Tooltip>
            </Col>
          </>
        )}
      </Container>
    ),
    operationName: capitalize(order.type),
    type: 'Order',
    signature: renderEntrySignature(order),
  };
}

function renderRefund(operation: RefundOperation) {
  return {
    status: operation.status,
    txId: (
      <CopyToClipboard
        text={operation.txId}
        onCopy={() => toast.info('Copied')}
      >
        <span style={{ cursor: 'pointer' }}>{truncate(operation.txId)}</span>
      </CopyToClipboard>
    ),
    operation: (
      <Container>
        <Col>
          <Tooltip text={'View on Explorer'} type="dark">
            <Button
              icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
              auto
              size="small"
              onClick={() => exploreTx(operation.txId)}
            />
          </Tooltip>
        </Col>
      </Container>
    ),
    operationName: operation,
    type: 'Refund',
    signature: renderEntrySignature(operation),
  };
}

// eslint-disable-next-line react/display-name
export const Content = React.memo(
  ({ operations }: { operations: AmmDexOperation[] | null }) => {
    const [open, handleOpen, handleClose] = useToggle(false);
    const [txId, setTxId] = useState('');

    if (operations === null) {
      return <Loading>Fetching operations...</Loading>;
    }

    if (operations?.length === 0) {
      return <Text p>No operations</Text>;
    }

    const handleRefundModalOpen = (txId: string) => {
      setTxId(txId);
      handleOpen();
    };

    const handleRefundModalClose = () => {
      setTxId('');
      handleClose();
    };

    const formattedOperations = operations.map((op) => {
      if (op.type === 'order') {
        return renderOrder(op, open, handleRefundModalOpen);
      } else if (op.type === 'refund') {
        return renderRefund(op);
      }
    });

    return (
      <>
        <Table data={formattedOperations}>
          <Table.Column prop="signature" label="Operation" />
          <Table.Column prop="type" label="Type" />
          <Table.Column prop="txId" label="TX ID" />
          <Table.Column prop="status" label="Status" />
          <Table.Column prop="operation" />
          {/*<Table.Column prop="summary" label="Summary" />*/}
        </Table>
        <RefundConfirmationModal
          txId={txId}
          open={open}
          onClose={handleRefundModalClose}
        />
      </>
    );
  },
);
