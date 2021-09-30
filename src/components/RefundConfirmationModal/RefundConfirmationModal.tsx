import { Address, ergoTxToProxy, TxId } from '@ergolabs/ergo-sdk';
import { Modal, Text } from '@geist-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import {
  useSettings,
  useWalletAddresses,
  WalletAddressState,
  WalletContext,
} from '../../context';
import { refund } from '../../utils/ammOperations';
import { SelectAddress } from '../SelectAddress/SelectAddress';

type RefundConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  txId: TxId;
};

export const RefundConfirmationModal = ({
  txId,
  open,
  onClose,
}: RefundConfirmationModalProps): JSX.Element => {
  const walletAddresses = useWalletAddresses();
  const [{ minerFee }] = useSettings();
  const { utxos } = useContext(WalletContext);
  const [address, setAddress] = useState<Address>();

  const addresses = useMemo(() => {
    return walletAddresses.state === WalletAddressState.LOADED
      ? walletAddresses.addresses
      : [];
  }, [walletAddresses]);

  useEffect(() => {
    setAddress(addresses[0]);
  }, [addresses]);

  const handleSelectAddress = (value: string | string[]) => {
    const selectedAddress = typeof value === 'string' ? value : value[0];
    setAddress(selectedAddress);
  };

  const handleRefund = async () => {
    if (utxos?.length && address) {
      try {
        const tx = await refund(utxos, { address, txId, minerFee });
        await ergo.submit_tx(ergoTxToProxy(tx));
        toast.success('Refunded successfully');
      } catch (err) {
        toast.error('Transaction refund was declined');
        console.error(err);
      }
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width="500px">
      <Modal.Title>Confirm Refund</Modal.Title>
      <Modal.Content>
        <Text p>Select refund address</Text>
        {addresses.length && (
          <SelectAddress
            addresses={addresses}
            onSelectAddress={handleSelectAddress}
          />
        )}
      </Modal.Content>
      <Modal.Action onClick={handleRefund}>Confirm</Modal.Action>
    </Modal>
  );
};
