import { Meta, Story } from '@storybook/react';
import { Col, Row } from 'antd';
import React, { useState } from 'react';

import { TokenInput } from './TokenInput';

export default {
  title: 'Components/TokenInput',
  component: TokenInput,
} as Meta<typeof TokenInput>;

export const Default: Story = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  return (
    <>
      <h2>Swap / Choose Token</h2>

      <Row gutter={[{ xs: 8, sm: 16, md: 16 }, 8]}>
        <Col span={8}>
          <TokenInput value={value1} onChange={setValue1} />
        </Col>
        <Col span={8}>
          <TokenInput
            value={value2}
            onChange={setValue2}
            tokenSymbol="erg"
            balance={0.02}
            tokenPrice={334.25}
          />
        </Col>
      </Row>
    </>
  );
};
