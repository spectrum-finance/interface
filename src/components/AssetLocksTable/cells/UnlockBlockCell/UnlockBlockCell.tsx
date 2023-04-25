import { Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AssetLock } from '../../../../common/models/AssetLock';

export interface UnlockBlockCellProps {
  readonly lock: AssetLock;
}

export const UnlockBlockCell: FC<UnlockBlockCellProps> = ({ lock }) => (
  <Typography.Body strong>{lock.deadline}</Typography.Body>
);
