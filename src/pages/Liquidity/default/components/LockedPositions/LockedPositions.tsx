import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Position } from '../../../../../common/models/Position';
import { TableView } from '../../../../../components/TableView/TableView';
import { PairColumn } from '../../../common/columns/LockedPositionsColumns/PairColumn/PairColumn';
import { ShareColumn } from '../../../common/columns/LockedPositionsColumns/ShareColumn/ShareColumn';
import { TotalLockedColumn } from '../../../common/columns/LockedPositionsColumns/TotalLockedColumn/TotalLockedColumn';
import { WithdrawableLockedColumn } from '../../../common/columns/LockedPositionsColumns/WithdrawableLockedColumn/WithdrawableLockedColumn';
import { RatioColumn } from '../../../common/columns/PoolsOrPositionsColumns/columns/RatioColumn/RatioColumn';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';

export interface LockedPositionsProps {
  readonly positions: Position[];
}

export const LockedPositions: FC<LockedPositionsProps> = ({ positions }) => {
  const navigate = useNavigate();

  return (
    <TableView
      items={positions}
      itemKey="deadline"
      itemHeight={80}
      maxHeight={376}
      gap={1}
      tableHeaderPadding={[0, 6]}
      tableItemViewPadding={[0, 4]}
    >
      <TableView.Column
        title={<Trans>Pair</Trans>}
        width={218}
        headerWidth={210}
      >
        {(position: Position) => <PairColumn position={position} />}
      </TableView.Column>
      <TableView.Column title={<Trans>Total locked</Trans>} width={200}>
        {(position: Position) => <TotalLockedColumn position={position} />}
      </TableView.Column>
      <TableView.Column title={<Trans>Total withdrawable</Trans>} width={200}>
        {(position: Position) => (
          <WithdrawableLockedColumn position={position} />
        )}
      </TableView.Column>
      <TableView.Column title={<Trans>Share</Trans>} width={115}>
        {(position: Position) => <ShareColumn position={position} />}
      </TableView.Column>
      <TableView.Column title={<Trans>Last 24H</Trans>} width={100}>
        {(position: Position) => <RatioColumn ammPool={position.pool} />}
      </TableView.Column>
      <TableView.Action
        onClick={(item: Position) => navigate(`${item.pool.id}/withdrawal`)}
      >
        <Trans>Withdrawal</Trans>
      </TableView.Action>
      <TableView.Action
        onClick={(item: Position) => navigate(`${item.pool.id}/relock`)}
      >
        <Trans>Relock</Trans>
      </TableView.Action>
      <TableView.State name="search" condition={!positions.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
