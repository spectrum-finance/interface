import React, { FC } from 'react';

import { Typography } from '../../../ergodex-cdk';
import { TableListItemView } from '../../TableListItemView/TableListItemView';

export const OperationHistoryHeaderTable: FC = () => (
  <TableListItemView height={40} padding={[0, 6]}>
    <TableListItemView.Column width={218} title={false}>
      <Typography.Body>Assets</Typography.Body>
    </TableListItemView.Column>
    <TableListItemView.Column width={152} title={false}>
      <Typography.Body>Type</Typography.Body>
    </TableListItemView.Column>
    <TableListItemView.Column width={152} title={false}>
      <Typography.Body>Date & Time</Typography.Body>
    </TableListItemView.Column>
    <TableListItemView.Column width={152} title={false}>
      <Typography.Body>Status</Typography.Body>
    </TableListItemView.Column>
    <TableListItemView.Column flex={1} title={false} />
  </TableListItemView>
);
