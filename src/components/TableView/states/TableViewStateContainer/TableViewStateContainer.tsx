import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Box, Flex } from '../../../../ergodex-cdk';

export interface TableViewStateContainerProps {
  readonly className?: string;
  readonly height: number;
  readonly icon?: ReactNode | ReactNode[] | string;
  readonly iconGutter?: number;
  readonly children?: ReactNode | ReactNode[];
}

const _TableViewStateContainer: FC<TableViewStateContainerProps> = ({
  className,
  height,
  icon,
  children,
  iconGutter,
}) => (
  <Box className={className} height={height}>
    <Flex stretch align="center" justify="center" col>
      {icon && (
        <Flex.Item marginBottom={children ? iconGutter || 4 : 0}>
          {icon}
        </Flex.Item>
      )}
      {children}
    </Flex>
  </Box>
);

export const TableViewStateContainer = styled(_TableViewStateContainer)`
  background: var(--ergo-pool-position-bg);
`;
