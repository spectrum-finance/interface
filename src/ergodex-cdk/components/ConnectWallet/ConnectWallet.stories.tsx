import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Col, Row } from '../index';
import { ConnectWallet } from './ConnectWallet';

export default {
  title: 'Components/ConnectWallet',
  component: ConnectWallet,
} as Meta<typeof ConnectWallet>;

export const Template: Story = () => (
  <div>
    <h1 style={{ marginBottom: 24 }}>Wallet Button</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 16]}>
      <h2>Default state</h2>
      <Col span={24}>
        <ConnectWallet isWalletConnected={false} numberOfPendingTxs={1} />
      </Col>

      <h2>Connecting state</h2>
      <Col span={24}>
        <ConnectWallet
          isWalletConnected={true}
          numberOfPendingTxs={0}
          balance={123}
          currency="ERG"
          address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
        />
      </Col>

      <h2>Pending state</h2>
      <Col span={24}>
        <ConnectWallet
          isWalletConnected={true}
          numberOfPendingTxs={2}
          balance={123.43}
          currency="ERG"
          address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
        />
      </Col>
    </Row>
  </div>
);
