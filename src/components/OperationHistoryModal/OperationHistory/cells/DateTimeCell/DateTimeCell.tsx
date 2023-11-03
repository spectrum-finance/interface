import { Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { OperationItem } from '../../../../../common/models/OperationV2';
import styles from './DateTimeCell.module.less';

export interface DateTimeCellProps {
  readonly operationItem: OperationItem;
}

export const DateTimeCell: FC<DateTimeCellProps> = ({ operationItem }) => (
  <Flex justify="flex-start" width={80} className={styles.dateTimeCell}>
    <Typography.Body size="small" align="center">
      {operationItem.registerTx.dateTime.toFormat('dd MMM, yy')}{' '}
      <Typography.Body secondary size="small">
        {operationItem.registerTx.dateTime.toFormat('HH:mm')}
      </Typography.Body>
    </Typography.Body>
  </Flex>
);
