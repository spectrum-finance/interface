import { FC } from 'react';

import { TableView } from '../../../../../components/TableView/TableView';
import { PairColumn } from '../../../common/columns/LockedPositionsColumns/PairColumn/PairColumn';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { LiquidityLockedPositionsProps } from '../../../common/types/LiquidityLockedPositionsProps';
import { LockedPositionDetails } from './LockedPositionDetails/LockedPositionDetails';

export const LockedPositions: FC<LiquidityLockedPositionsProps> = ({
  positionsWithLocks,
}) => (
  <TableView
    items={positionsWithLocks}
    itemKey="id"
    itemHeight={68}
    maxHeight="calc(100vh - 338px)"
    gap={1}
    showHeader={false}
    tableItemViewPadding={2}
    expand={{ height: 216, component: LockedPositionDetails, accordion: true }}
  >
    <TableView.Column flex={1}>
      {(position) => <PairColumn position={position} />}
    </TableView.Column>
    <TableView.State name="search" condition={!positionsWithLocks.length}>
      <LiquiditySearchState />
    </TableView.State>
  </TableView>
);
