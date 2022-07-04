import { LoadingOutlined } from '@ant-design/icons';
import { Box, Flex, Spin } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

export interface TableListLoadingProps {
  readonly className?: string;
  readonly height: number;
  readonly children?: ReactNode | ReactNode[];
}

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 40px;
  color: var(--ergo-table-view-icon);
`;

const _TableListLoading: FC<TableListLoadingProps> = ({
  className,
  height,
}) => (
  <Box className={className} height={height}>
    <Flex stretch align="center" justify="center">
      <Spin indicator={<LoadingIcon />} />
    </Flex>
  </Box>
);

export const TableListLoading = styled(_TableListLoading)`
  background: var(--ergo-pool-position-bg);
`;
