import {
  CheckOutlined,
  ClockCircleOutlined,
  Flex,
  Tag,
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

const QueuedStatusCell: FC = () => (
  <Tag color="warning">
    <Flex>
      <Flex.Item marginRight={1}>
        <ClockCircleOutlined />
      </Flex.Item>
      <Trans>Queuing...</Trans>
    </Flex>
  </Tag>
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
    statusCell = <QueuedStatusCell />;
  }

  return <Flex justify="flex-start">{statusCell}</Flex>;
};
