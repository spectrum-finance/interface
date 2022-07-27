import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { TableView } from '../../../../../components/TableView/TableView';
import { PoolsOverviewLoadingState } from '../../../common/tableViewStates/PoolsOverviewLoadingState/PoolsOverviewLoadingState';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PoolDetails } from './PoolDetails/PoolDetails';

export interface PoolsOverviewProps {
  readonly ammPools: AmmPool[];
  readonly loading?: boolean;
}

export const PoolsOverview: FC<PoolsOverviewProps> = ({
  ammPools,
  loading,
}) => (
  <PoolsOrPositionsTableView
    expandComponent={PoolDetails}
    items={ammPools}
    poolMapper={(ammPool: AmmPool) => ammPool}
  >
    <TableView.State name="loading" condition={loading}>
      <PoolsOverviewLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
