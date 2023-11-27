import { FC } from 'react';

import { Position } from '../../../../../common/models/Position';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import PositionEmpty from '../../common/PoolsOrPositionsTableView/PositionEmpty';
import TableLoading from '../../common/PoolsOrPositionsTableView/TableLoading';
import { PositionDetails } from './PositionDetails/PositionDetails';

export interface YourPositionsProps {
  readonly positions: Position[];
  readonly isPositionsLoading?: boolean;
  readonly isPositionsEmpty: boolean;
  readonly myLiquidity: boolean;
}

export const YourPositions: FC<YourPositionsProps> = ({
  positions,
  isPositionsLoading,
  isPositionsEmpty,
  myLiquidity,
}) => {
  if (isPositionsLoading) {
    return <TableLoading />;
  }

  if (!isPositionsLoading && isPositionsEmpty) {
    return <PositionEmpty />;
  }

  return (
    <PoolsOrPositionsTableView
      expandComponent={PositionDetails}
      items={positions}
      poolMapper={(position: Position) => position}
      isPositionsEmpty={isPositionsEmpty}
      isPositionsLoading={isPositionsLoading}
      myLiquidity={myLiquidity}
    />
  );
};
