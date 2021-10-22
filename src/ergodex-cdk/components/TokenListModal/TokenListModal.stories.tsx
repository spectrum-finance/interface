import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from '../index';
import { TokenListModal } from './TokenListModal';

export default {
  title: 'Components/TokenListModal',
  component: TokenListModal,
} as Meta<typeof TokenListModal>;

export const Default: Story = () => {
  const [showTokenList, setShowTokenList] = useState(false);

  const handleCancel = () => {
    setShowTokenList(false);
  };

  return (
    <>
      <h2>Token List Modal</h2>

      <Button onClick={() => setShowTokenList(true)}>Select Token</Button>

      <TokenListModal visible={showTokenList} onCancel={handleCancel} />
    </>
  );
};
