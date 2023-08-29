import { FC } from 'react';

import { ListSkeletonLoadingState } from '../../../../../components/SkeletonLoader/ListSkeletonLoadingState.tsx';
import { TableView } from '../../../../../components/TableView/TableView';
import { LiquidityPoolsOverviewProps } from '../../../common/types/LiquidityPoolsOverviewProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';

export const PoolsOverview: FC<LiquidityPoolsOverviewProps> = ({
  ammPools,
  isAmmPoolsLoading,
}) => (
  <PoolsOrPositionsTableView
    expandHeight={392}
    poolMapper={(pool) => pool}
    items={ammPools}
  >
    <TableView.State name="loading" condition={isAmmPoolsLoading}>
      <ListSkeletonLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
