import React, { FC, ReactNode } from 'react';

import { Typography } from '../..';
import { Flex } from '../Flex/Flex';
import { ReactComponent as EmptyIcon } from './empty.svg';

interface EmptyProps {
  size?: 's' | 'm' | 'l';
  children?: ReactNode;
}

export const Empty: FC<EmptyProps> = ({ children }) => (
  <Flex col>
    <Flex.Item marginBottom={3}>
      <EmptyIcon />
    </Flex.Item>
    <Typography.Body>{children}</Typography.Body>
  </Flex>
);
