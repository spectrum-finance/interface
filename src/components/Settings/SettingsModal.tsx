import { Modal } from '@geist-ui/react';
import React, { useEffect } from 'react';

import { useSettings } from '../../context';
import { useWalletAddresses, WalletAddressState } from '../../context';
import { walletCookies } from '../../utils/cookies';
import { SettingsForm } from './SettingsForm';

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

  useEffect(() => {
    if (!walletCookies.isSetConnected() && settings.address) {
      setSettings({
        ...settings,
        address: undefined,
      });
    }
  });

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
