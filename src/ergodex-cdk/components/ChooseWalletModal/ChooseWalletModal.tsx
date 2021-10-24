import React from 'react';

import { Modal, Typography } from '../index';

interface ChooseWalletModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  isOpen,
  onCancel,
}) => {
  return (
    <Modal visible={isOpen} onCancel={onCancel}>
      <Typography.Title level={1}>Wallet</Typography.Title>
    </Modal>
  );
};

export { ChooseWalletModal };
