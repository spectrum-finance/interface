import { Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { OperationItem } from '../../../../../network/ergo/api/operations/history/v2/types/OperationItem';

export interface DateTimeCellProps {
  readonly operationItem: OperationItem;
}

export const DateTimeCell: FC<DateTimeCellProps> = ({ operationItem }) => (
  <Typography.Body size="small">
    {operationItem.registerTx.dateTime.toFormat('dd MMM, yy')}{' '}
    <Typography.Body secondary size="small">
      {operationItem.registerTx.dateTime.toFormat('HH:mm')}
    </Typography.Body>
  </Typography.Body>
);
