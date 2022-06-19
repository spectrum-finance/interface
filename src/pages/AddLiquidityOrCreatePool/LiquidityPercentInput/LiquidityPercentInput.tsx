import { Button, Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

export interface LiquidityPercentInput {
  readonly onClick?: (pct: number) => void;
}

export const LiquidityPercentInput: FC<LiquidityPercentInput> = ({
  onClick,
}) => {
  const handleClick = (pct: number) => onClick && onClick(pct);

  return (
    <Flex>
      <Flex.Item marginRight={1}>
        <Button size="small" onClick={() => handleClick(25)}>
          25%
        </Button>
      </Flex.Item>
      <Flex.Item marginRight={1}>
        <Button size="small" onClick={() => handleClick(50)}>
          50%
        </Button>
      </Flex.Item>
      <Flex.Item marginRight={1}>
        <Button size="small" onClick={() => handleClick(75)}>
          75%
        </Button>
      </Flex.Item>
      <Flex.Item>
        <Button size="small" onClick={() => handleClick(100)}>
          100%
        </Button>
      </Flex.Item>
    </Flex>
  );
};
