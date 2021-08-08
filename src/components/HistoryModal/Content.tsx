import React from 'react';
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
import { capitalize } from 'lodash';

function renderOrder(
  { status, txId, order }: AmmOrder,
  open: boolean,
  handleOpen: () => void,
  handleClose: () => void,
) {
  return {
    status,
    txId: (
      <CopyToClipboard text={txId} onCopy={() => toast.info('Copied')}>
        <span style={{ cursor: 'pointer' }}>{truncate(txId)}</span>
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
              onClick={() => exploreTx(txId)}
            />
          </Tooltip>
        </Col>
        {isRefundableOperation(status) && (
          <>
            <Spacer x={0.2} />
            <Col>
              <Tooltip text={'Refund transaction'} type="dark">
                <Button
                  auto
                  size="small"
                  onClick={handleOpen}
                  icon={<FontAwesomeIcon icon={faUndo} />}
                />
              </Tooltip>
            </Col>
            <RefundConfirmationModal
              txId={txId}
              open={open}
              onClose={handleClose}
            />
          </>
        )}
      </Container>
    ),
    operationName: capitalize(order.type),
    type: 'Order',
  };
}

function renderRefund({ status, txId, operation }: RefundOperation) {
  return {
    status,
    txId: (
      <CopyToClipboard text={txId} onCopy={() => toast.info('Copied')}>
        <span style={{ cursor: 'pointer' }}>{truncate(txId)}</span>
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
              onClick={() => exploreTx(txId)}
            />
          </Tooltip>
        </Col>
      </Container>
    ),
    operationName: operation,
    type: 'Refund',
  };
}

// eslint-disable-next-line react/display-name
export const Content = React.memo(
  ({ operations }: { operations: AmmDexOperation[] | null }) => {
    const [open, handleOpen, handleClose] = useToggle(false);

    if (operations === null) {
      return <Loading>Fetching operations...</Loading>;
    }

    if (operations?.length === 0) {
      return <Text p>No operations</Text>;
    }

    const formattedOperations = operations.map((op) => {
      if (op.type === 'order') {
        return renderOrder(op, open, handleOpen, handleClose);
      } else if (op.type === 'refund') {
        return renderRefund(op);
      }
    });

    return (
      <Table data={formattedOperations}>
        <Table.Column prop="operationName" label="Operation Name" />
        <Table.Column prop="type" label="Type" />
        <Table.Column prop="txId" label="TX ID" />
        <Table.Column prop="status" label="Status" />
        <Table.Column prop="operation" />
        {/*<Table.Column prop="summary" label="Summary" />*/}
      </Table>
    );
  },
);
