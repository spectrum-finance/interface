import React, { FC, ReactNode } from 'react';

import { Control, Flex, Input, Typography } from '../../../../ergodex-cdk';
import { FeeBox } from './FeeBox/FeeBox';

interface FeeDescriptor {
  readonly percent: number;
  readonly description: string;
  readonly content: ReactNode | ReactNode[] | string;
}

const FEES: FeeDescriptor[] = [
  {
    percent: 0.3,
    description: 'Best for most pairs',
    content: '0.3% fee',
  },
  {
    percent: 1,
    description: 'Best for exotic pairs',
    content: '1% fee',
  },
];

export type FeeSelectorProps = Control<number>;

export const FeeSelector: FC<FeeSelectorProps> = ({ value, onChange }) => {
  const handleItemClick = (percent: number) => onChange && onChange(percent);

  const handleInputChange = (percent: number) => onChange && onChange(percent);

  return (
    <Flex>
      {FEES.map((fee) => (
        <Flex.Item key={fee.percent} flex={1} marginRight={2}>
          <FeeBox
            onClick={() => handleItemClick(fee.percent)}
            active={fee.percent === value}
            description={fee.description}
            content={fee.content}
          />
        </Flex.Item>
      ))}
      <Flex.Item flex={1}>
        <FeeBox
          active={!!value && FEES.every((fee) => value !== fee.percent)}
          description="Custom fee tier"
          content={
            <Input
              size="small"
              type="number"
              align="right"
              onChange={(e) => handleInputChange(e.target.valueAsNumber)}
              suffix={<Typography.Body>%</Typography.Body>}
            />
          }
        />
      </Flex.Item>
    </Flex>
  );
};
