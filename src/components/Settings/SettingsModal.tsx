import React from 'react';
import { Modal } from '@geist-ui/react';
import { SettingsForm } from './SettingsForm';
import { useSettings } from '../../context/SettingsContext';

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

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Title>{content.title}</Modal.Title>
      <Modal.Content>
        <SettingsForm
          settings={settings}
          setSettings={setSettings}
          onConnectWallet={() => {
            return;
          }}
        />
      </Modal.Content>
      <Modal.Action onClick={onClose}>{content.close}</Modal.Action>
    </Modal>
  );
};
