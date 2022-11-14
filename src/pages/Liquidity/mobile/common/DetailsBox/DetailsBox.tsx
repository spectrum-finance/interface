import React, { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export interface DetailsBoxProps {
  readonly title: ReactNode | ReactNode[] | string;
  readonly value: ReactNode | ReactNode[] | string;
}

export const DetailRow = styled(Flex.Item)`
  &:nth-of-type(2n) {
    div {
      background: transparent;
    }
  }
`;

export const DetailsBox: FC<DetailsBoxProps> = ({ title, value }) => (
  <Box padding={2} bordered={false} borderRadius="l">
    <Flex stretch align="center">
      <Flex.Item flex={1}>
        <Typography.Body size="small">{title}</Typography.Body>
      </Flex.Item>
      <Flex.Item justify="flex-end" display="flex">
        <Typography.Body strong>{value}</Typography.Body>
      </Flex.Item>
    </Flex>
  </Box>
);
