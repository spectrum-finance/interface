import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from '../Button/Button';
import { Modal } from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
} as Meta<typeof Modal>;

export const BasicModal: Story = () => {
  const [isShownModal, setIsShownModal] = useState(false);

  return (
    <>
      <h1>Modal</h1>
      <h3>Basic Modal</h3>
      <Button onClick={() => setIsShownModal(true)}>Open Modal</Button>
      <Modal
        title="Basic Modal"
        visible={isShownModal}
        onCancel={() => setIsShownModal(false)}
        footer={[
          <Button
            style={{ width: '100%' }}
            key="confirm"
            type="primary"
            size="large"
          >
            Confirm
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};
