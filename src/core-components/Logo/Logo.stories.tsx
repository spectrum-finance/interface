import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { Logo } from './Logo';

export default {
  title: 'Components/Logo',
  component: Logo,
} as Meta<typeof Logo>;

export const Template: Story = () => (
  <div>
    <h1>Logo</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 32]}>
      <Col span={24}>
        <Logo label />
      </Col>
      <Col span={24}>
        <Logo />
      </Col>
    </Row>
  </div>
);
