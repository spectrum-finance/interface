import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { Header } from './Header';

export default {
  title: 'Components/Header',
  component: Header,
} as Meta<typeof Header>;

export const Template: Story = (args) => (
  <div>
    <h1>Header</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 64]}>
      <Col span={24}>
        <Header {...args} />
      </Col>
    </Row>
  </div>
);
