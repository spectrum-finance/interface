import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Button, Flex } from '../../../../../ergodex-cdk';
import { TableViewEmptyState } from '../../../../TableView/states/TableViewEmptyState/TableViewEmptyState';

export interface OperationsEmptyStateProps {
  readonly onSwapNowButtonClick?: () => void;
}

export const OperationsEmptyState: FC<OperationsEmptyStateProps> = ({
  onSwapNowButtonClick,
}) => (
  <TableViewEmptyState height={275}>
    <Flex align="center" col>
      <Flex.Item marginBottom={4}>
        <Trans>Your transactions will appear here</Trans>
      </Flex.Item>
      <Button type="primary" onClick={onSwapNowButtonClick}>
        <Trans>Swap now</Trans>
      </Button>
    </Flex>
  </TableViewEmptyState>
);
