import { FC } from 'react';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import TableLoading from '../../common/PoolsOrPositionsTableView/TableLoading';
import { PoolDetails } from './PoolDetails/PoolDetails';

export interface PoolsOverviewProps {
  readonly ammPools: AmmPool[];
  readonly loading?: boolean;
  readonly myLiquidity: boolean;
}

export const PoolsOverview: FC<PoolsOverviewProps> = ({
  ammPools,
  loading,
  myLiquidity,
}) => {
  if (loading) {
    return <TableLoading />;
  }
  return (
    <PoolsOrPositionsTableView
      expandComponent={PoolDetails}
      items={ammPools}
      poolMapper={(ammPool: AmmPool) => ammPool}
      myLiquidity={myLiquidity}
      loading={loading}
    />
  );
};
