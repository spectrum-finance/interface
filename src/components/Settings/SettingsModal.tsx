import React from 'react';
import { Modal } from '@geist-ui/react';
import { SettingsForm } from './SettingsForm';
import { useSettings } from '../../context/SettingsContext';
import {
  useWalletAddresses,
  WalletAddressState,
} from '../../context/AddressContext';

const content = {
  title: 'Transaction settings',
  close: 'OK',
};

type SettingsModalProps = {
  open?: boolean;
  onClose?: () => void;
  onConnectWallet?: () => void;
  isWalletConnected?: boolean;
};

export const SettingsModal = (props: SettingsModalProps): JSX.Element => {
  const { open = false, onClose } = props;

  const [settings, setSettings] = useSettings();
  const walletAddresses = useWalletAddresses();

  const addresses =
    walletAddresses.state === WalletAddressState.LOADED
      ? walletAddresses.addresses
      : [];

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Title>{content.title}</Modal.Title>
      <Modal.Content>
        <SettingsForm
          settings={settings}
          setSettings={setSettings}
          addresses={addresses}
        />
      </Modal.Content>
      <Modal.Action onClick={onClose}>{content.close}</Modal.Action>
    </Modal>
  );
};
