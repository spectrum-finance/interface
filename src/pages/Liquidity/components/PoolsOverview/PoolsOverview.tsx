import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { TableView } from '../../../../components/TableView/TableView';
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
      <LoadingDataState height={160}>
        <Trans>Loading pools history.</Trans>
        <br />
        <Trans>Please wait.</Trans>
      </LoadingDataState>
    </TableView.State>
  </PoolsOrPositionsTableView>
);
