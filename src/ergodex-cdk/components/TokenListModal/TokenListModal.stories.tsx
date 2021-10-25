import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Button, Modal } from '../index';
import { TokenListModal } from './TokenListModal';

export default {
  title: 'Components/TokenListModal',
  component: TokenListModal,
} as Meta<typeof TokenListModal>;

interface DialogRef<T = any> {
  close: (result?: T) => void;
}

export const Default: Story = () => {
  const handleOpenModal = () => {
    Modal.open(
      (param: DialogRef<boolean>) => {
        return <TokenListModal close={param.close} />;
      },
      { title: 'Select a token' },
    );
  };

  return (
    <>
      <h2>Token List Modal</h2>

      <Button onClick={handleOpenModal}>Select Token</Button>
    </>
  );
};
