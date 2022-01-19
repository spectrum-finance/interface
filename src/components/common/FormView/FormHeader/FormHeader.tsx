import React from 'react';

import { Currency } from '../../../../common/models/Currency';
import { Flex, Typography } from '../../../../ergodex-cdk';
import { TokenIconPair } from '../../../TokenIconPair/TokenIconPair';

interface FormHeaderProps {
  x: Currency;
  y: Currency;
}

const FormHeader: React.FC<FormHeaderProps> = ({ x, y }) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex.Item>
        <Flex align="center">
          <Flex.Item display="flex" marginRight={2}>
            <TokenIconPair
              tokenPair={{
                tokenA: x.asset.name,
                tokenB: y.asset.name,
              }}
            />
          </Flex.Item>
          <Flex.Item>
            <Typography.Title level={4}>
              {x.asset.name} / {y.asset.name}
            </Typography.Title>
          </Flex.Item>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export { FormHeader };
