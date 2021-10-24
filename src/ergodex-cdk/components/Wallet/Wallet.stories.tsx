import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { WalletModal } from './Wallet';

export default {
  title: 'Components/WalletModal',
  component: WalletModal,
} as Meta<typeof WalletModal>;

export const Template: Story = () => (
  <div>
    <h1>WalletModal</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 32]}>
      <Col span={24}>
        <WalletModal />
      </Col>
    </Row>
  </div>
);
