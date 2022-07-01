import { Button, EmptyDataState, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

export interface OperationsEmptyStateProps {
  readonly onSwapNowButtonClick?: () => void;
}

export const OperationsEmptyState: FC<OperationsEmptyStateProps> = ({
  onSwapNowButtonClick,
}) => (
  <EmptyDataState height={275}>
    <Flex align="center" col>
      <Flex.Item marginBottom={4}>
        <Trans>Your transactions will appear here</Trans>
      </Flex.Item>
      <Button type="primary" onClick={onSwapNowButtonClick}>
        <Trans>Swap now</Trans>
      </Button>
    </Flex>
  </EmptyDataState>
);
