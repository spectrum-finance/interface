import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { Operation } from '../../../common/TxHistory/types';
import { TableListItemView } from '../../../TableListItemView/TableListItemView';
import { AssetsColumn } from './AssetsColumn/AssetsColumn';
import { DateTimeColumn } from './DateTimeColumn/DateTimeColumn';
import { StatusTag } from './StatusTag/StatusTag';
import { TypeTag } from './TypeTag/TypeTag';

export interface OperationItemProps {
  readonly operation: Operation;
  readonly className?: string;
}

export const OperationItemView: FC<OperationItemProps> = ({
  className,
  operation,
}) => (
  <TableListItemView className={className} padding={[2, 4]} height={104}>
    <TableListItemView.Column title={t`Asset`} flex={1} marginRight={10}>
      <AssetsColumn operation={operation} />
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Date`} width={120} marginRight={8}>
      <DateTimeColumn dateTime={operation.timestamp} />
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Type`} width={120} marginRight={8}>
      <TypeTag type={operation.type} />
    </TableListItemView.Column>
    <TableListItemView.Column title={t`Status`} width={120}>
      <StatusTag status={operation.status} />
    </TableListItemView.Column>
  </TableListItemView>
);
