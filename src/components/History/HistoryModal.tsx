import React, { memo, useEffect, useState } from 'react';
import { Loading, Modal, Table, Text } from '@geist-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  useWalletAddresses,
  WalletAddressState,
} from '../../context/AddressContext';
import { DefaultAmmOpsParser, Explorer, NetworkOperations } from 'ergo-dex-sdk';
import { AmmOperation } from 'ergo-dex-sdk/build/module/amm/models/ammOperation';
import { useInterval } from '../../hooks/useInterval';
import { toast } from 'react-toastify';
import { explorer } from '../../utils/explorer';

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
        // operation: <div>{summary}</div>,
      }),
    );
    return (
      <Table data={formattedOperations}>
        <Table.Column prop="boxId" label="Box ID" />
        <Table.Column prop="txId" label="TX ID" />
        {/* <Table.Column prop="operation" label="Operation" /> */}
        <Table.Column prop="status" label="Status" />
        {/* <Table.Column prop="summary" label="Summary" /> */}
      </Table>
    );
  },
);

export const HistoryModal = (props: HistoryModalProps): JSX.Element => {
  const { open = false, onClose } = props;
  const [operations, setOperations] = useState<AmmOperation[] | null>(null);

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
        <Content operations={operations}></Content>
      </Modal.Content>
      <Modal.Action onClick={onClose}>{content.close}</Modal.Action>
    </Modal>
  );
};
