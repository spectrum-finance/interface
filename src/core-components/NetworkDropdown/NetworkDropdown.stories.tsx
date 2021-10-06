import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { NetworkDropdown } from './NetworkDropdown';

export default {
  title: 'Components/NetworkDropdown',
  component: NetworkDropdown,
} as Meta<typeof NetworkDropdown>;

const networks = [
  { name: 'ergo', token: 'erg-orange' },
  { name: 'cardano', token: 'ada' },
];

export const Default: Story = () => (
  <>
    <h2>Network Dropdown</h2>
    <h5>Default</h5>
    <NetworkDropdown networks={networks} />
  </>
);
export const Disabled: Story = () => (
  <>
    <h2>Network Dropdown</h2>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <h5>Ergo Disabled</h5>
        <NetworkDropdown
          networks={[{ name: 'ergo', token: 'erg-orange' }]}
          disabled
        />
      </Col>
      <Col span={8}>
        <h5>Cardano Disabled</h5>
        <NetworkDropdown
          networks={[{ name: 'cardano', token: 'ada' }]}
          disabled
        />
      </Col>
    </Row>
  </>
);
