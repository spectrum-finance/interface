import { Button, EmptyDataState, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

export interface OperationsEmptyStateProps {
  readonly onSwapNowButtonClick?: () => void;
  readonly height?: number;
}

export const OperationsEmptyState: FC<OperationsEmptyStateProps> = ({
  onSwapNowButtonClick,
  height,
}) => (
  <EmptyDataState height={height || 275}>
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
