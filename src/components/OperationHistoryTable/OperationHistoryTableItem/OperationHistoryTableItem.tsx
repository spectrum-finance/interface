import React, { FC } from 'react';

import { isSwapOperation, Operation } from '../../../common/models/Operation';
import { TableListItemView } from '../../TableList/TableListItemView/TableListItemView';
import { DateTimeCell } from './DateTimeCell/DateTimeCell';
import { DepositAssetCell } from './DepositAssetCell/DepositAssetCell';
import { StatusCell } from './StatusCell/StatusCell';
import { SwapAssetCell } from './SwapAssetCell/SwapAssetCell';
import { TypeCell } from './TypeCell/TypeCell';

export interface OperationHistoryTableItemProps {
  readonly operation: Operation;
}

export const OperationHistoryTableItem: FC<OperationHistoryTableItemProps> = ({
  operation,
}) => {
  const swapAssetCell = isSwapOperation(operation) ? (
    <SwapAssetCell base={operation.base} quote={operation.quote} />
  ) : (
    <DepositAssetCell x={operation.x} y={operation.y} />
  );

  return (
    <TableListItemView height={80} padding={[0, 6]}>
      <TableListItemView.Column width={218} title={false}>
        {swapAssetCell}
      </TableListItemView.Column>
      <TableListItemView.Column width={152} title={false}>
        <TypeCell type={operation.type} />
      </TableListItemView.Column>
      <TableListItemView.Column width={152} title={false}>
        <DateTimeCell dateTime={operation.dateTime} />
      </TableListItemView.Column>
      <TableListItemView.Column width={152} title={false}>
        <StatusCell status={operation.status} />
      </TableListItemView.Column>
      <TableListItemView.Column flex={1} title={false} />
    </TableListItemView>
  );
};
