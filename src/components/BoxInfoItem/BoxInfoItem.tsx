import React, { FC, ReactNode } from 'react';

import { Flex } from '../../ergodex-cdk';

export interface BoxInfoItemProps {
  title: ReactNode | ReactNode[] | string;
  value: ReactNode | ReactNode[] | string;
}

export const BoxInfoItem: FC<BoxInfoItemProps> = ({ title, value }) => (
  <Flex>
    <Flex.Item flex={1}>{title}</Flex.Item>
    <Flex.Item>{value}</Flex.Item>
  </Flex>
);
