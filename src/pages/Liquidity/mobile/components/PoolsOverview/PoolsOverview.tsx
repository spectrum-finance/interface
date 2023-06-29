import { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PositionsLoadingState } from '../../../common/tableViewStates/PositionsLoadingState/PositionsLoadingState.tsx';
import { LiquidityPoolsOverviewProps } from '../../../common/types/LiquidityPoolsOverviewProps';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PoolDetails } from './PoolDetails/PoolDetails';

export const PoolsOverview: FC<LiquidityPoolsOverviewProps> = ({
  ammPools,
  isAmmPoolsLoading,
}) => (
  <PoolsOrPositionsTableView
    expandHeight={392}
    poolMapper={(pool) => pool}
    items={ammPools}
    expandComponent={PoolDetails}
  >
    <TableView.State name="loading" condition={isAmmPoolsLoading}>
      <PositionsLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
