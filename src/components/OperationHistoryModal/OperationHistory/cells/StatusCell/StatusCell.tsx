import {
  CheckOutlined,
  ClockCircleOutlined,
  Flex,
  Tag,
  Tooltip,
  UndoOutlined,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, ReactNode } from 'react';

import {
  OperationItem,
  OperationStatus,
} from '../../../../../common/models/OperationV2';

interface StatusCellProps {
  readonly operationItem: OperationItem;
}

const EvaluatedStatusCell: FC = () => (
  <Tag color="success">
    <Flex>
      <Flex.Item marginRight={1}>
        <CheckOutlined />
      </Flex.Item>
      <Trans>Executed</Trans>
    </Flex>
  </Tag>
);

const QueuedStatusCell: FC<{ inMemPool?: boolean }> = ({ inMemPool }) => (
  <Tooltip
    visible={inMemPool ? undefined : false}
    title={<Trans>Transaction is in Mempool now</Trans>}
  >
    <Tag color="warning">
      <Flex>
        <Flex.Item marginRight={1}>
          <ClockCircleOutlined />
        </Flex.Item>
        <Trans>Queuing...</Trans>
      </Flex>
    </Tag>
  </Tooltip>
);

const RefundedStatusCell: FC = () => (
  <Tag color="pink">
    <Flex>
      <Flex.Item marginRight={1}>
        <UndoOutlined />
      </Flex.Item>
      <Trans>Canceled</Trans>
    </Flex>
  </Tag>
);

export const StatusCell: FC<StatusCellProps> = ({ operationItem }) => {
  let statusCell: ReactNode | ReactNode[];

  if (operationItem.status === OperationStatus.Evaluated) {
    statusCell = <EvaluatedStatusCell />;
  } else if (operationItem.status === OperationStatus.Refunded) {
    statusCell = <RefundedStatusCell />;
  } else {
    statusCell = (
      <QueuedStatusCell
        inMemPool={operationItem.status === OperationStatus.Pending}
      />
    );
  }

  return <Flex justify="flex-start">{statusCell}</Flex>;
};
