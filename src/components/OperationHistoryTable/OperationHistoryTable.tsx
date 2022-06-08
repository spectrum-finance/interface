import React, { FC } from 'react';

import { Operation } from '../../common/models/Operation';
import { Flex, List } from '../../ergodex-cdk';
import { TableListLoading } from '../TableList/TableListLoading/TableListLoading';
import { OperationHistoryHeaderTable } from './OperationHistoryHeaderTable/OperationHistoryHeaderTable';
import { OperationHistoryTableItem } from './OperationHistoryTableItem/OperationHistoryTableItem';

export interface TransactionHistoryTableProps {
  readonly operations: Operation[];
  readonly loading: boolean;
}

export const OperationHistoryTable: FC<TransactionHistoryTableProps> = ({
  operations,
  loading,
}) => (
  <Flex col>
    <Flex.Item marginBottom={1}>
      <OperationHistoryHeaderTable />
    </Flex.Item>
    {loading && <TableListLoading height={332} />}
    {!loading && (
      <List rowKey="id" dataSource={operations} maxHeight={332} gap={1}>
        {(item) => <OperationHistoryTableItem operation={item} />}
      </List>
    )}
  </Flex>
);
