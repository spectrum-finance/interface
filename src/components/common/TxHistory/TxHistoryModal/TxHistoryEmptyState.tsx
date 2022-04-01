import React, { FC } from 'react';
import styled from 'styled-components';

import { Box, Flex } from '../../../../ergodex-cdk';
import { Empty } from '../../../../ergodex-cdk/components/Empty/Empty';

interface TxHistoryEmptyStateProps {
  readonly className?: string;
}

const _TxHistoryEmptyState: FC<TxHistoryEmptyStateProps> = ({ className }) => (
  <Box className={className}>
    <Flex col justify="center" stretch align="center">
      <Empty>Your transactions will appear here</Empty>
    </Flex>
  </Box>
);

export const TxHistoryEmptyState = styled(_TxHistoryEmptyState)`
  background: var(--ergo-pool-position-bg);
  height: 275px;
`;
