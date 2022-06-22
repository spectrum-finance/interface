import { Box, Flex } from '@ergolabs/ui-kit';
import { Empty } from '@ergolabs/ui-kit/dist/components/Empty/Empty';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

export interface EmptyTemplateContainer {
  className?: string;
  children?: ReactNode | ReactNode[] | string;
}

const _PositionListEmptyTemplate: FC<EmptyTemplateContainer> = ({
  className,
  children,
}) => (
  <Box className={className}>
    <Flex col justify="center" stretch align="center">
      <Empty>{children}</Empty>
    </Flex>
  </Box>
);

export const PositionListEmptyTemplate = styled(_PositionListEmptyTemplate)`
  background: var(--ergo-pool-position-bg);
  height: 160px;
`;
