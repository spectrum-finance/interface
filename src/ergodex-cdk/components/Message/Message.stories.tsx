import { Meta, Story } from '@storybook/react';
import { Space } from 'antd';
import React from 'react';

import { message } from '../../services/message';
import { Button } from '../Button/Button';

export default {
  title: 'Components/Message',
} as Meta;

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export const Default: Story = () => {
  const openNotificationWithIcon = (type: MessageType): void => {
    message[type]('This is the content of the message.');
  };
  return (
    <>
      <h2>Notification</h2>
      <Space>
        <Button onClick={() => openNotificationWithIcon('success')}>
          Success
        </Button>
        <Button onClick={() => openNotificationWithIcon('info')}>Info</Button>
        <Button onClick={() => openNotificationWithIcon('warning')}>
          Warning
        </Button>
        <Button onClick={() => openNotificationWithIcon('error')}>Error</Button>
        <Button onClick={() => openNotificationWithIcon('loading')}>
          Loading
        </Button>
      </Space>
    </>
  );
};
