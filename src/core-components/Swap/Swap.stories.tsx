import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React from 'react';

import { Swap } from './Swap';

export default {
  title: 'Components/Swap',
  component: Swap,
} as Meta<typeof Swap>;

export const Default: Story = () => {
  return (
    <>
      <h2>Swap</h2>

      <Row gutter={[{ xs: 8, sm: 16, md: 16 }, 8]}>
        <Col>
          <Swap />
        </Col>
      </Row>
    </>
  );
};
