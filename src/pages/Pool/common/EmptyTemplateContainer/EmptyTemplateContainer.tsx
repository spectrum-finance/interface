import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Box, Flex } from '../../../../ergodex-cdk';
import { Empty } from '../../../../ergodex-cdk/components/Empty/Empty';

export interface EmptyTemplateContainer {
  className?: string;
  children?: ReactNode | ReactNode[] | string;
}

const _EmptyTemplateContainer: FC<EmptyTemplateContainer> = ({
  className,
  children,
}) => (
  <Box className={className}>
    <Flex col justify="center" stretch align="center">
      <Empty>{children}</Empty>
    </Flex>
  </Box>
);

export const EmptyTemplateContainer = styled(_EmptyTemplateContainer)`
  background: var(--ergo-pool-position-bg);
  height: 160px;
`;
