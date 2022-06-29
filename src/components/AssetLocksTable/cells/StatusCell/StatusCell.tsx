import { Tag } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import {
  AssetLock,
  AssetLockStatus,
} from '../../../../common/models/AssetLock';

export interface StatusCellProps {
  readonly lock: AssetLock;
}

export const StatusCell: FC<StatusCellProps> = ({ lock }) => (
  <Tag
    color={lock.status === AssetLockStatus.LOCKED ? 'warning' : 'success'}
    style={{ display: 'block', marginBottom: '2px' }}
  >
    {lock.status === 0 ? 'Locked' : 'Withdrawable'}
  </Tag>
);
