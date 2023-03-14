import { Box, Divider } from '@ergolabs/ui-kit';
import { Flex } from '@ergolabs/ui-kit/dist/components/Flex/Flex';
import React, { FC, ReactNode } from 'react';

export interface OperationDetailContainerProps {
  readonly leftSide: ReactNode | ReactNode[] | string;
  readonly rightSide: ReactNode | ReactNode[] | string;
}

export const OperationDetailsContainer: FC<OperationDetailContainerProps> = ({
  leftSide,
  rightSide,
}) => (
  <Box bordered={false} height="100%" padding={4} accent glass>
    <Flex stretch width="100%">
      <Flex.Item flex={1}>{leftSide}</Flex.Item>
      <Flex.Item marginRight={4} marginLeft={4}>
        <Divider type="vertical" />
      </Flex.Item>
      <Flex.Item flex={1}>{rightSide}</Flex.Item>
    </Flex>
  </Box>
);
