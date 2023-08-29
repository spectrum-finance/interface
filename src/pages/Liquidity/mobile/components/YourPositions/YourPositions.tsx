import { FC } from 'react';

import { ListSkeletonLoadingState } from '../../../../../components/SkeletonLoader/ListSkeletonLoadingState.tsx';
import { TableView } from '../../../../../components/TableView/TableView';
import { PositionEmptyState } from '../../../common/tableViewStates/PositionEmptyState/PositionEmptyState';
import { LiquidityYourPositionsProps } from '../../../common/types/LiquidityYourPositionsProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';

export const YourPositions: FC<LiquidityYourPositionsProps> = ({
  positions,
  isPositionsLoading,
  isPositionsEmpty,
}) => (
  <PoolsOrPositionsTableView
    expandHeight={464}
    poolMapper={(position) => position.pool}
    items={positions}
  >
    <TableView.State name="loading" condition={isPositionsLoading}>
      <ListSkeletonLoadingState />
    </TableView.State>
    <TableView.State name="empty" condition={isPositionsEmpty}>
      <PositionEmptyState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
