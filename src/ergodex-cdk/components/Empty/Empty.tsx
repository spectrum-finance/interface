import React, { FC, ReactNode } from 'react';

import { Flex } from '../Flex/Flex';
import { Typography } from '../Typography/Typography';
import { ReactComponent as EmptyIcon } from './empty.svg';

interface EmptyProps {
  size?: 's' | 'm' | 'l';
  children?: ReactNode;
}

export const Empty: FC<EmptyProps> = ({ children }) => (
  <Flex col align="center">
    <Flex.Item marginBottom={3}>
      <EmptyIcon />
    </Flex.Item>
    <Typography.Body>{children}</Typography.Body>
  </Flex>
);
