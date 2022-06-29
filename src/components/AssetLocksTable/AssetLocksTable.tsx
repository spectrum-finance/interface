import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { AssetLock } from '../../common/models/AssetLock';
import { RowRendererProps } from '../TableView/common/RowRenderer';
import { TableView } from '../TableView/TableView';
import { PairCell } from './cells/PairCell/PairCell';
import { StatusCell } from './cells/StatusCell/StatusCell';
import { UnlockBlockCell } from './cells/UnlockBlockCell/UnlockBlockCell';
import { UnlockDateCell } from './cells/UnlockDateCell/UnlockDateCell';
import { SelectableItemRowRenderer } from './selectableItemRowRenderer/selectableItemRowRenderer';

export interface AssetLocksTableProps {
  readonly locks: AssetLock[];
  readonly value?: AssetLock;
  readonly onChange?: (value?: AssetLock) => void;
}

export const AssetLocksTable: FC<AssetLocksTableProps> = ({
  value,
  onChange,
  locks,
}) => {
  const handleRowClick = (lock: AssetLock) => {
    if (onChange) {
      onChange(lock);
    }
  };

  return (
    <TableView
      hoverable
      itemKey="deadline"
      items={locks}
      itemHeight={80}
      maxHeight={264}
      itemRowRenderer={(props: RowRendererProps, item: AssetLock) => (
        <SelectableItemRowRenderer
          onClick={() => handleRowClick(item)}
          selected={item.boxId === value?.boxId}
          {...props}
        />
      )}
      gap={2}
      tablePadding={[0, 6]}
    >
      <TableView.Column title={<Trans>Pair</Trans>}>
        {(lock: AssetLock) => <PairCell lock={lock} />}
      </TableView.Column>
      <TableView.Column width={123} title={<Trans>Unlock date</Trans>}>
        {(lock: AssetLock) => <UnlockDateCell lock={lock} />}
      </TableView.Column>
      <TableView.Column width={123} title={<Trans>Unlock block</Trans>}>
        {(lock: AssetLock) => <UnlockBlockCell lock={lock} />}
      </TableView.Column>
      <TableView.Column width={123} title={<Trans>Status</Trans>}>
        {(lock: AssetLock) => <StatusCell lock={lock} />}
      </TableView.Column>
    </TableView>
  );
};
