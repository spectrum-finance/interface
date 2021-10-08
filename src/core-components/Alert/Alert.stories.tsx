import './Alert.stories.css';

import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { Alert } from './Alert';

export default {
  title: 'Components/Alert',
  component: Alert,
} as Meta<typeof Alert>;

export const Template: Story = () => (
  <div className="basic-board">
    <h1>Alert</h1>
    <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
      <Col span={8}>
        <Alert message="Alert title" type="info" />
      </Col>
    </Row>
  </div>
);
