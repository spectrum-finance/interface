import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Position } from '../../../../common/models/Position';
import { TableView } from '../../../../components/TableView/TableView';
import { PairCell } from './cells/PairCell/PairCell';
import { ShareCell } from './cells/ShareCell/ShareCell';
import { TotalLockedCell } from './cells/TotalLockedCell/TotalLockedCell';
import { WithdrawableLockedCell } from './cells/WithdrawableLockedCell/WithdrawableLockedCell';

export interface LockedPositionsProps {
  readonly positions: Position[];
}

export const LockedPositionsProps: FC<LockedPositionsProps> = ({
  positions,
}) => {
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
        {(position: Position) => <PairCell position={position} />}
      </TableView.Column>
      <TableView.Column title={<Trans>Total locked</Trans>} width={200}>
        {(position: Position) => <TotalLockedCell position={position} />}
      </TableView.Column>
      <TableView.Column title={<Trans>Total withdrawable</Trans>} width={200}>
        {(position: Position) => <WithdrawableLockedCell position={position} />}
      </TableView.Column>
      <TableView.Column title={<Trans>Share</Trans>} width={115}>
        {(position: Position) => <ShareCell position={position} />}
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
    </TableView>
  );
};
