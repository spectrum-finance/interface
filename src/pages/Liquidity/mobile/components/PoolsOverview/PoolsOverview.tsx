import { Button } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PoolsOverviewLoadingState } from '../../../common/tableViewStates/PoolsOverviewLoadingState/PoolsOverviewLoadingState';
import { LiquidityPoolsOverviewProps } from '../../../common/types/LiquidityPoolsOverviewProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';

export const PoolsOverview: FC<LiquidityPoolsOverviewProps> = ({
  ammPools,
  isAmmPoolsLoading,
}) => (
  <PoolsOrPositionsTableView
    poolMapper={(pool) => pool}
    items={ammPools}
    expandComponent={Button as any}
  >
    <TableView.State name="loading" condition={isAmmPoolsLoading}>
      <PoolsOverviewLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
