import './ConnectWallet.stories.scss';

import { Meta, Story } from '@storybook/react';
import { Button, Col, Divider, Form, Row } from 'antd';
import React from 'react';

import ConnectWallet from './ConnectWallet';

export default {
  title: 'Components/ConnectWallet',
  component: ConnectWallet,
} as Meta<typeof ConnectWallet>;

export const Template: Story = () => (
  <div className="main-board">
    <h1 style={{ marginBottom: 4 }}>Wallet Button</h1>
    <p>Wallet status and balance information</p>
    <h2 style={{ marginTop: 24 }}>When to use</h2>
    <p style={{ marginBottom: 0 }}>If it is necessary to show:</p>
    <ul style={{ marginBottom: 0 }}>
      <li>Еhe address of the wallet.</li>
      <li>Wallet balance.</li>
      <li>Wallet status.</li>
    </ul>
    <p>
      The Balnce only, “Address Only” and “Pending Icon” types are used in the
      mobile phone adaptive.
    </p>

    <Divider style={{ color: 'white' }} />

    <h1>Type=Connect to Wallet</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <Button className="connect-to-wallet">Connect to wallet</Button>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <Button className="connect-to-wallet hover">Connect to wallet</Button>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <Button className="connect-to-wallet pressed">Connect to wallet</Button>
      </Col>
    </Row>

    <h1>Type=Wallet Connected</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <ConnectWallet
          type="wallet-connected"
          balance={0}
          address="0x088a...378a"
        ></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <ConnectWallet
          type="wallet-connected"
          status="hover"
          balance={0}
          address="0x088a...378a"
        ></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <ConnectWallet
          type="wallet-connected"
          status="pressed"
          balance={0}
          address="0x088a...378a"
        ></ConnectWallet>
      </Col>
    </Row>

    <h1>Type=Balance Only</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <ConnectWallet type="balance-only" balance={0}></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <ConnectWallet
          type="balance-only"
          status="hover"
          balance={0}
        ></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <ConnectWallet
          type="balance-only"
          status="pressed"
          balance={0}
        ></ConnectWallet>
      </Col>
    </Row>

    <h1>Type=Address Only</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <ConnectWallet
          type="address-only"
          address="0x088a...378a"
        ></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <ConnectWallet
          type="address-only"
          status="hover"
          address="0x088a...378a"
        ></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <ConnectWallet
          type="address-only"
          status="pressed"
          address="0x088a...378a"
        ></ConnectWallet>
      </Col>
    </Row>

    <h1>Type=Pending</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <ConnectWallet type="pending" balance={0}></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <ConnectWallet
          type="pending"
          status="hover"
          balance={0}
        ></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <ConnectWallet
          type="pending"
          status="pressed"
          balance={0}
        ></ConnectWallet>
      </Col>
    </Row>

    <h1>Type=Pending Text</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <ConnectWallet type="pending-text"></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <ConnectWallet type="pending-text" status="hover"></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <ConnectWallet type="pending-text" status="pressed"></ConnectWallet>
      </Col>
    </Row>

    <h1>Type=Pending Icon</h1>

    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Default</h5>
        <ConnectWallet type="pending-icon"></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Hover</h5>
        <ConnectWallet type="pending-icon" status="hover"></ConnectWallet>
      </Col>
      <Col span={8}>
        <h5>Pressed</h5>
        <ConnectWallet type="pending-icon" status="pressed"></ConnectWallet>
      </Col>
    </Row>
  </div>
);
