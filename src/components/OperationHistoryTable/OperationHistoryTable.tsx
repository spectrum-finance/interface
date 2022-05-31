import React, { FC } from 'react';

import { Operation } from '../../common/models/Operation';
import { Flex, List } from '../../ergodex-cdk';
import { OperationHistoryHeaderTable } from './OperationHistoryHeaderTable/OperationHistoryHeaderTable';
import { OperationHistoryTableItem } from './OperationHistoryTableItem/OperationHistoryTableItem';

export interface TransactionHistoryTableProps {
  readonly operations: Operation[];
}

export const OperationHistoryTable: FC<TransactionHistoryTableProps> = ({
  operations,
}) => (
  <Flex col>
    <Flex.Item marginBottom={1}>
      <OperationHistoryHeaderTable />
    </Flex.Item>
    <List rowKey="id" dataSource={operations} maxHeight={332} gap={1}>
      {(item) => <OperationHistoryTableItem operation={item} />}
    </List>
  </Flex>
);
