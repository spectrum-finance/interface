import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Position } from '../../../../../common/models/Position';
import { TableView } from '../../../../../components/TableView/TableView';
import { PairColumn } from '../../../common/columns/LockedPositionsColumns/PairColumn/PairColumn';
import { ShareColumn } from '../../../common/columns/LockedPositionsColumns/ShareColumn/ShareColumn';
import { TotalLockedColumn } from '../../../common/columns/LockedPositionsColumns/TotalLockedColumn/TotalLockedColumn';
import { WithdrawableLockedColumn } from '../../../common/columns/LockedPositionsColumns/WithdrawableLockedColumn/WithdrawableLockedColumn';
import { LiquiditySearchState } from '../../../common/tableViewStates/LiquiditySearchState/LiquiditySearchState';
import { LiquidityLockedPositionsProps } from '../../../common/types/LiquidityLockedPositionsProps';

export const LockedPositions: FC<LiquidityLockedPositionsProps> = ({
  positionsWithLocks,
}) => {
  const navigate = useNavigate();

  return (
    <TableView
      items={positionsWithLocks}
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
      <TableView.Column title={<Trans>Total withdrawable</Trans>} width={230}>
        {(position: Position) => (
          <WithdrawableLockedColumn position={position} />
        )}
      </TableView.Column>
      <TableView.Column title={<Trans>Share</Trans>} width={115}>
        {(position: Position) => <ShareColumn position={position} />}
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
      <TableView.State name="search" condition={!positionsWithLocks.length}>
        <LiquiditySearchState />
      </TableView.State>
    </TableView>
  );
};
