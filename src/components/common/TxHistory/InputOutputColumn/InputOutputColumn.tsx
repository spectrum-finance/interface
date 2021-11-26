import React from 'react';

import { ArrowRightOutlined, Flex, Typography } from '../../../../ergodex-cdk';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import { TokenIconPair } from '../../../TokenIconPair/TokenIconPair';
import { OperationAsset, OperationType } from '../types';

interface InputOutputColumnProps {
  pair: {
    x: OperationAsset;
    y: OperationAsset;
  };
  type: OperationType;
}

const InputOutputColumn: React.FC<InputOutputColumnProps> = ({
  pair,
  type,
}) => {
  if (type === 'deposit') {
    return (
      <Flex align="center">
        <Flex.Item marginRight={2}>
          <TokenIconPair
            tokenPair={{ tokenA: pair.x.name, tokenB: pair.y.name }}
          />
        </Flex.Item>
        <Flex.Item>
          <Flex>
            <Flex.Item marginRight={2}>
              <Flex direction="col">
                <Flex.Item>
                  <Typography.Body strong>{pair.x.name}:</Typography.Body>
                </Flex.Item>
                <Flex.Item>
                  <Typography.Body strong>{pair.y.name}:</Typography.Body>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex direction="col">
                <Flex.Item>
                  <Typography.Footnote>{pair.x.amount}</Typography.Footnote>
                </Flex.Item>
                <Flex.Item>
                  <Typography.Footnote>{pair.y.amount}</Typography.Footnote>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex.Item marginRight={2}>
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <TokenIcon name={pair.x.name} />
          </Flex.Item>
          <Typography.Body strong>{pair.x.name}</Typography.Body>
        </Flex>
      </Flex.Item>
      <Flex.Item marginRight={2}>
        <Typography.Body>
          <ArrowRightOutlined />
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <TokenIcon name={pair.y.name} />
          </Flex.Item>
          <Typography.Body strong>{pair.y.name}</Typography.Body>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export { InputOutputColumn };
