import React, { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PoolsOverviewLoadingState } from '../../../common/tableViewStates/PoolsOverviewLoadingState/PoolsOverviewLoadingState';
import { PositionEmptyState } from '../../../common/tableViewStates/PositionEmptyState/PositionEmptyState';
import { LiquidityYourPositionsProps } from '../../../common/types/LiquidityYourPositionsProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PositionDetails } from './PositionDetails/PositionDetails';

export const YourPositions: FC<LiquidityYourPositionsProps> = ({
  positions,
  isPositionsLoading,
  isPositionsEmpty,
}) => (
  <PoolsOrPositionsTableView
    expandHeight={400}
    poolMapper={(position) => position.pool}
    items={positions}
    expandComponent={PositionDetails}
  >
    <TableView.State name="loading" condition={isPositionsLoading}>
      <PoolsOverviewLoadingState />
    </TableView.State>
    <TableView.State name="empty" condition={isPositionsEmpty}>
      <PositionEmptyState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
