import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../../common/models/Position';
import { TableView } from '../../../../components/TableView/TableView';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PositionDetails } from './PositionDetails/PositionDetails';
import { PositionEmptyState } from './PositionEmptyState/PositionEmptyState';

export interface PoolsOverviewProps {
  readonly positions: Position[];
  readonly loading?: boolean;
  readonly isPositionsEmpty: boolean;
}

export const YourPositions: FC<PoolsOverviewProps> = ({
  positions,
  loading,
  isPositionsEmpty,
}) => (
  <PoolsOrPositionsTableView
    expandComponent={PositionDetails}
    items={positions}
    poolMapper={(position: Position) => position.pool}
  >
    <TableView.State name="loading" condition={loading}>
      <LoadingDataState height={160}>
        <Trans>Loading positions history.</Trans>
        <br />
        <Trans>Please wait.</Trans>
      </LoadingDataState>
    </TableView.State>
    <TableView.State name="empty" condition={isPositionsEmpty}>
      <PositionEmptyState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
