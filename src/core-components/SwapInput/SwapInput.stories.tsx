import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React, { useState } from 'react';

import { SwapInput } from './SwapInput';

export default {
  title: 'Components/SwapInput',
  component: SwapInput,
} as Meta<typeof SwapInput>;

export const Default: Story = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  return (
    <>
      <h2>Swap Input</h2>

      <Row gutter={[{ xs: 10, sm: 20, md: 25 }, 5]}>
        <Col span={5}>
          <SwapInput
            value={value1}
            onChange={setValue1}
            tokenName="ERG"
            balance={0.02}
          />
        </Col>
        <Col span={5}>
          <SwapInput value={value2} onChange={setValue2} />
        </Col>
      </Row>
    </>
  );
};
