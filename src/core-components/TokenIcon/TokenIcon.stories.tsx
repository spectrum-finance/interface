import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { TokenIcon } from './TokenIcon';

export default {
  title: 'Components/TokenIcon',
  component: TokenIcon,
} as Meta<typeof TokenIcon>;

export const Template: Story = () => {
  return (
    <>
      <h2>Token Icon</h2>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 8]}>
        <Col span={6}>
          <h4>Ergo icon</h4>
          <TokenIcon name="erg" />
        </Col>
        <Col span={6}>
          <h4>Ergo orange icon</h4>
          <TokenIcon name="erg-orange" />
        </Col>
        <Col span={6}>
          <h4>Ada icon</h4>
          <TokenIcon name="ada" />
        </Col>
        <Col span={6}>
          <h4>Empty token icon</h4>
          <TokenIcon />
        </Col>
      </Row>
    </>
  );
};
