import { Tag } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import {
  AssetLock,
  AssetLockStatus,
} from '../../../../common/models/AssetLock';

export interface StatusCellProps {
  readonly lock: AssetLock;
}

export const StatusCell: FC<StatusCellProps> = ({ lock }) => (
  <Tag color={lock.status === AssetLockStatus.LOCKED ? 'warning' : 'success'}>
    {lock.status === 0 ? t`Locked` : t`Withdrawable`}
  </Tag>
);
