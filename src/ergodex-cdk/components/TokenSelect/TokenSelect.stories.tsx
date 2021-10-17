import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { TokenSelect } from './TokenSelect';

export default {
  title: 'Components/TokenSelect',
  component: TokenSelect,
} as Meta<typeof TokenSelect>;

export const Template: Story = () => {
  return (
    <>
      <h2>Token Select</h2>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
        <Col span={8}>
          <h5>Select a token</h5>
        </Col>
        <Col span={8}>
          <h5>Selected Token</h5>
        </Col>
        <Col span={8}>
          <h5>No Logo Token</h5>
        </Col>
        <Col span={8}>
          <TokenSelect />
        </Col>
        <Col span={8}>
          <TokenSelect name="ada" />
        </Col>
        <Col span={8}>
          <TokenSelect name="emp" />
        </Col>
      </Row>
    </>
  );
};
