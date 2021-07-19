import React, { useContext, useState } from 'react';
import { Modal, Text } from '@geist-ui/react';
import { refund } from '../../utils/ammOperations';
import {
  useWalletAddresses,
  WalletAddressState,
} from '../../context/AddressContext';
import { SelectAddress } from '../SelectAddress/SelectAddress';
import { BoxId, TxId } from 'ergo-dex-sdk/build/main/ergo';
import { BoxSelection } from 'ergo-dex-sdk/build/module/ergo/wallet/entities/boxSelection';
import { explorer } from '../../utils/explorer';
import { DefaultBoxSelector } from 'ergo-dex-sdk/build/module/ergo';
import { NanoErgInErg } from '../../constants/erg';
import { useSettings } from '../../context/SettingsContext';
import { WalletContext } from '../../context/WalletContext';
import {
  OperationSummary,
  SwapSummary,
} from 'ergo-dex-sdk/build/module/amm/models/operationSummary';

type ConfirmRefundModalProps = {
  open?: boolean;
  onClose?: () => void;
  txId: TxId;
  summary: OperationSummary;
};

export const ConfirmRefundModal = ({
  txId,
  summary,
  open,
  onClose,
}: ConfirmRefundModalProps): JSX.Element => {
  const [address, setAddress] = useState('');
  const walletAddresses = useWalletAddresses();
  const [{ minerFee }] = useSettings();
  const { utxos } = useContext(WalletContext);

  const addresses =
    walletAddresses.state === WalletAddressState.LOADED
      ? walletAddresses.addresses
      : [];

  const handleSelectAddress = (value: string | string[]) => {
    const selectedAddress = typeof value === 'string' ? value : value[0];
    setAddress(selectedAddress);
  };

  // --

  const handleRefund = async () => {
    const minerFeeNErgs = BigInt(Number(minerFee) * NanoErgInErg);
    const networkContext = await explorer.getNetworkContext();
    const nErgsRequired = minerFeeNErgs;

    const params = {
      txId,
      recipientAddress: address,
    };

    console.log('params', params);
    console.log('summary', summary);

    if (utxos?.length) {
      const inputs = DefaultBoxSelector.select(utxos, {
        nErgs: nErgsRequired,
        assets: [
          {
            tokenId: summary.from.asset.id,
            amount: summary.from.amount,
          },
        ],
      });

      if (inputs instanceof BoxSelection) {
        const txContext = {
          inputs,
          changeAddress: address,
          selfAddress: address,
          feeNErgs: minerFeeNErgs,
          network: networkContext,
        };

        refund(params, txContext);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="1000px">
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
