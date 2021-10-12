import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { Button } from '../Button/Button';
import ConnectWallet from './ConnectWallet';

export default {
  title: 'Components/ConnectWallet',
  component: ConnectWallet,
} as Meta<typeof ConnectWallet>;

export const Template: Story = () => (
  <div className="connect-wallet__container">
    <h1 style={{ marginBottom: 24 }}>Wallet Button</h1>

    <h2>Type=Connect to Wallet</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <Button className="connect-wallet__default-btn">
          Connect to wallet
        </Button>
      </Col>
    </Row>

    <h2>Type=Wallet Connected</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <ConnectWallet
          type="default"
          balance="0 ERG"
          address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
        />
      </Col>
    </Row>

    <h2>Type=Balance Only</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <ConnectWallet type="balance-only" balance="0 ERG" />
      </Col>
    </Row>

    <h2>Type=Address Only</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <ConnectWallet
          type="address-only"
          address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
        />
      </Col>
    </Row>

    <h2>Type=Pending</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <ConnectWallet type="pending" balance="0 ERG" />
      </Col>
    </Row>

    <h2>Type=Pending Text</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <ConnectWallet type="pending-text" />
      </Col>
    </Row>

    <h2>Type=Pending Icon</h2>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <ConnectWallet type="pending-icon" />
      </Col>
    </Row>
  </div>
);
