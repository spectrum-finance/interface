import { LoadingDataState } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../../common/models/Position';
import { TableView } from '../../../../components/TableView/TableView';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PositionDetails } from './PositionDetails/PositionDetails';

export interface PoolsOverviewProps {
  readonly positions: Position[];
  readonly loading?: boolean;
}

export const YourPositions: FC<PoolsOverviewProps> = ({
  positions,
  loading,
}) => (
  <PoolsOrPositionsTableView
    expandComponent={PositionDetails}
    items={positions}
    poolMapper={(position: Position) => position.pool}
  >
    <TableView.State name="loading" condition={loading}>
      <LoadingDataState height={150}>
        <Trans>Loading positions history.</Trans>
        <br />
        <Trans>Please wait.</Trans>
      </LoadingDataState>
    </TableView.State>
  </PoolsOrPositionsTableView>
);
