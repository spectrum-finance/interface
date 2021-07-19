import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal, Text } from '@geist-ui/react';
import { refund } from '../../utils/ammOperations';
import {
  useWalletAddresses,
  WalletAddressState,
} from '../../context/AddressContext';
import { SelectAddress } from '../SelectAddress/SelectAddress';
import { TxId } from 'ergo-dex-sdk/build/main/ergo';
import { BoxSelection } from 'ergo-dex-sdk/build/module/ergo/wallet/entities/boxSelection';
import { explorer } from '../../utils/explorer';
import { Address, DefaultBoxSelector } from 'ergo-dex-sdk/build/module/ergo';
import { numOfErgDecimals } from '../../constants/erg';
import { useSettings } from '../../context/SettingsContext';
import { WalletContext } from '../../context/WalletContext';
import { userInputToFractions } from '../../utils/walletMath';

type ConfirmRefundModalProps = {
  open: boolean;
  onClose: () => void;
  txId: TxId;
};

export const ConfirmRefundModal = ({
  txId,
  open,
  onClose,
}: ConfirmRefundModalProps): JSX.Element => {
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
    const minerFeeNErgs = userInputToFractions(minerFee, numOfErgDecimals);
    const networkContext = await explorer.getNetworkContext();

    if (utxos?.length && address) {
      const params = {
        txId,
        recipientAddress: address,
      };

      const inputs = DefaultBoxSelector.select(utxos, {
        nErgs: minerFeeNErgs,
        assets: [],
      });

      if (inputs instanceof BoxSelection) {
        const txContext = {
          inputs,
          changeAddress: address,
          selfAddress: address,
          feeNErgs: minerFeeNErgs,
          network: networkContext,
        };

        await refund(params, txContext);
      }
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width="300px">
      <Modal.Title>Confirm Refund</Modal.Title>
      <Modal.Content>
        <Text p>Select refund address</Text>
        {addresses.length && (
          <SelectAddress
            addresses={addresses}
            handleSelectAddress={handleSelectAddress}
          />
        )}
      </Modal.Content>
      <Modal.Action onClick={() => handleRefund()}>Confirm</Modal.Action>
    </Modal>
  );
};
