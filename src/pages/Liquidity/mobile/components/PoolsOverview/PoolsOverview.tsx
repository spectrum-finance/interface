import React, { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PoolsOverviewLoadingState } from '../../../common/tableViewStates/PoolsOverviewLoadingState/PoolsOverviewLoadingState';
import { LiquidityPoolsOverviewProps } from '../../../common/types/LiquidityPoolsOverviewProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { LiquidityStateSelect } from '../LiquidityStateSelect/LiquidityStateSelect';

export const PoolsOverview: FC<LiquidityPoolsOverviewProps> = ({
  ammPools,
  isAmmPoolsLoading,
}) => (
  <PoolsOrPositionsTableView
    poolMapper={(pool) => pool}
    items={ammPools}
    expandComponent={LiquidityStateSelect}
  >
    <TableView.State name="loading" condition={isAmmPoolsLoading}>
      <PoolsOverviewLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
