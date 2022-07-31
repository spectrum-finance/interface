import React, { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PoolsOverviewLoadingState } from '../../../common/tableViewStates/PoolsOverviewLoadingState/PoolsOverviewLoadingState';
import { LiquidityPoolsOverviewProps } from '../../../common/types/LiquidityPoolsOverviewProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PoolDetails } from './PoolDetails/PoolDetails';

export const PoolsOverview: FC<LiquidityPoolsOverviewProps> = ({
  ammPools,
  isAmmPoolsLoading,
}) => (
  <PoolsOrPositionsTableView
    expandHeight={336}
    poolMapper={(pool) => pool}
    items={ammPools}
    expandComponent={PoolDetails}
  >
    <TableView.State name="loading" condition={isAmmPoolsLoading}>
      <PoolsOverviewLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
