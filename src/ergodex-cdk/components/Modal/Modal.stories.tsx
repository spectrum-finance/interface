import { Meta, Story } from '@storybook/react';
import React, { FC, useState } from 'react';

import { Button } from '../Button/Button';
import { Modal } from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
} as any;

export const BasicModal: Story = () => {
  const openModal = () => {
    Modal.open(<div>test</div>);
  };

  return (
    <>
      <h1>Modal</h1>
      <h3>Basic Modal</h3>
      <Button onClick={openModal}>Open Modal</Button>
    </>
  );
};
