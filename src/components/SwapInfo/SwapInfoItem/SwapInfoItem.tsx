import React, { FC, ReactNode } from 'react';

import { Flex, Typography } from '../../../ergodex-cdk';

export interface SwapInfoItemProps {
  title: ReactNode;
  value: ReactNode;
  secondary?: boolean;
}

export const SwapInfoItem: FC<SwapInfoItemProps> = ({
  value,
  title,
  secondary,
}) => (
  <Flex align="center" justify="space-between">
    <Flex.Item>
      <Typography.Body secondary={secondary}>{title}</Typography.Body>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body secondary={secondary}>{value}</Typography.Body>
    </Flex.Item>
  </Flex>
);
