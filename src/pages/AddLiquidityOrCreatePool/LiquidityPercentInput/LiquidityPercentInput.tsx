import { Button, Flex } from '@ergolabs/ui-kit';
import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import React, { FC } from 'react';

export interface LiquidityPercentInput {
  readonly onClick?: (pct: number) => void;
}

enum percentInputOptions {
  twentyFive = 25,
  fifty = 50,
  seventyFive = 75,
  all = 100,
}

const firePercentInputAnalyticsEvent = (pct: percentInputOptions): void => {
  switch (pct) {
    case percentInputOptions.twentyFive:
      fireAnalyticsEvent('Deposit Click 25%');
      return;
    case percentInputOptions.fifty:
      fireAnalyticsEvent('Deposit Click 50%');
      return;
    case percentInputOptions.seventyFive:
      fireAnalyticsEvent('Deposit Click 75%');
      return;
    default:
      fireAnalyticsEvent('Deposit Click 100%');
  }
};

export const LiquidityPercentInput: FC<LiquidityPercentInput> = ({
  onClick,
}) => {
  const handleClick = (pct: percentInputOptions) => {
    firePercentInputAnalyticsEvent(pct);
    return onClick && onClick(pct);
  };

  return (
    <Flex>
      <Flex.Item marginRight={1}>
        <Button
          size="small"
          onClick={() => handleClick(percentInputOptions.twentyFive)}
        >
          25%
        </Button>
      </Flex.Item>
      <Flex.Item marginRight={1}>
        <Button
          size="small"
          onClick={() => handleClick(percentInputOptions.fifty)}
        >
          50%
        </Button>
      </Flex.Item>
      <Flex.Item marginRight={1}>
        <Button
          size="small"
          onClick={() => handleClick(percentInputOptions.seventyFive)}
        >
          75%
        </Button>
      </Flex.Item>
      <Flex.Item>
        <Button
          size="small"
          onClick={() => handleClick(percentInputOptions.all)}
        >
          100%
        </Button>
      </Flex.Item>
    </Flex>
  );
};
