import React, { useEffect, useState } from 'react';
import {
  Loading,
  Modal,
  Table,
  Text,
  Button,
  Container,
  Col,
  Spacer,
  Tooltip,
} from '@geist-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  useWalletAddresses,
  WalletAddressState,
} from '../../context/AddressContext';
import { DefaultAmmOpsParser, NetworkOperations } from 'ergo-dex-sdk';
import { AmmOperation } from 'ergo-dex-sdk/build/module/amm/models/ammOperation';
import { useInterval } from '../../hooks/useInterval';
import { toast } from 'react-toastify';
import { explorer } from '../../utils/explorer';
import mockOperation from './mockTx';
import { exploreTx } from '../../utils/redirect';
import { isRefundableOperation } from '../../utils/ammOperations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useToggle } from '../../hooks/useToggle';
import { ConfirmRefundModal } from '../ConfirmRefundModal/ConfirmRefundModal';

const content = {
  title: 'Transactions history',
  close: 'OK',
};

type HistoryModalProps = {
  open?: boolean;
  onClose?: () => void;
  onConnectWallet?: () => void;
  isWalletConnected?: boolean;
};

// eslint-disable-next-line react/display-name
const Content = React.memo(
  ({ operations }: { operations: AmmOperation[] | null }) => {
    const [open, handleOpen, handleClose] = useToggle(false);

    if (operations === null) {
      return <Loading>Fetching opertaions...</Loading>;
    }

    if (operations?.length === 0) {
      return <Text p>No operations</Text>;
    }

    const formattedOperations = operations.map(
      ({ boxId, status, txId, summary }) => ({
        boxId: (
          <CopyToClipboard text={boxId} onCopy={() => toast.info('Copied')}>
            <span style={{ cursor: 'pointer' }}>
              {boxId.slice(0, 16)}...{boxId.slice(48)}
            </span>
          </CopyToClipboard>
        ),
        status,
        txId: (
          <CopyToClipboard text={txId} onCopy={() => toast.info('Copied')}>
            <span style={{ cursor: 'pointer' }}>
              {txId.slice(0, 16)}...{txId.slice(48)}
            </span>
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
                <ConfirmRefundModal
                  txId={txId}
                  summary={summary}
                  open={open}
                  onClose={handleClose}
                />
              </>
            )}
          </Container>
        ),
      }),
    );
    return (
      <Table data={formattedOperations}>
        <Table.Column prop="boxId" label="Box ID" />
        <Table.Column prop="txId" label="TX ID" />
        <Table.Column prop="status" label="Status" />
        <Table.Column prop="operation" />
        {/*<Table.Column prop="summary" label="Summary" />*/}
      </Table>
    );
  },
);

export const HistoryModal = (props: HistoryModalProps): JSX.Element => {
  const { open = false, onClose } = props;
  const [operations, setOperations] = useState<AmmOperation[] | null>([
    mockOperation,
  ]);

  const walletAddresses = useWalletAddresses();

  useEffect(() => {
    if (
      !(
        walletAddresses.state === WalletAddressState.LOADED &&
        operations === null
      )
    )
      return;

    const network = explorer;
    const parser = new DefaultAmmOpsParser();
    new NetworkOperations(network, parser)
      .getAllByAddresses(walletAddresses.addresses, 20)
      .then(setOperations);
  }, [walletAddresses, operations]);

  useInterval(() => {
    if (
      !(
        walletAddresses.state === WalletAddressState.LOADED &&
        operations === null
      )
    )
      return;

    const network = explorer;
    const parser = new DefaultAmmOpsParser();
    new NetworkOperations(network, parser)
      .getAllByAddresses(walletAddresses.addresses, 20)
      .then(setOperations);
  }, 10 * 1000);

  return (
    <Modal open={open} onClose={onClose} width="1000px">
      <Modal.Title>{content.title}</Modal.Title>
      <Modal.Content>
        <Content operations={operations} />
      </Modal.Content>
      <Modal.Action onClick={onClose}>{content.close}</Modal.Action>
    </Modal>
  );
};
