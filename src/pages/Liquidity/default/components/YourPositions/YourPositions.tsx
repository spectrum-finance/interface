import React, { FC } from 'react';

import { Position } from '../../../../../common/models/Position';
import { TableView } from '../../../../../components/TableView/TableView';
import { PositionEmptyState } from '../../../common/tableViewStates/PositionEmptyState/PositionEmptyState';
import { YourPositionsLoadingState } from '../../../common/tableViewStates/YourPositionsLoadingState/YourPositionsLoadingState';
import { LiquidityYourPositionsProps } from '../../../common/types/LiquidityYourPositionsProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PositionDetails } from './PositionDetails/PositionDetails';

export const YourPositions: FC<LiquidityYourPositionsProps> = ({
  positions,
  isPositionsLoading,
  isPositionsEmpty,
}) => (
  <PoolsOrPositionsTableView
    expandComponent={PositionDetails}
    items={positions}
    poolMapper={(position: Position) => position.pool}
  >
    <TableView.State name="loading" condition={isPositionsLoading}>
      <YourPositionsLoadingState />
    </TableView.State>
    <TableView.State name="empty" condition={isPositionsEmpty}>
      <PositionEmptyState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
