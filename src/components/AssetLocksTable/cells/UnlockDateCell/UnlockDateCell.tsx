import { Typography } from '@ergolabs/ui-kit';
import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { AssetLock } from '../../../../common/models/AssetLock';

export interface UnlockDateCellProps {
  readonly lock: AssetLock;
}

export const UnlockDateCell: FC<UnlockDateCellProps> = ({ lock }) => (
  <Typography.Body strong>
    {lock.unlockDate.toLocaleString(DateTime.DATE_FULL)}
  </Typography.Body>
);
