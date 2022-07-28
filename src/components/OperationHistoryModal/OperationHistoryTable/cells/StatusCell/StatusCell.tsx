import {
  CheckOutlined,
  ClockCircleOutlined,
  Flex,
  Loading3QuartersOutlined,
  LockOutlined,
  Tag,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { OperationStatus } from '../../../../../common/models/Operation';

interface StatusCellProps {
  readonly status: OperationStatus;
}

const ExecutedStatusCell: FC = () => (
  <Tag color="success">
    <Flex>
      <Flex.Item marginRight={1}>
        <CheckOutlined />
      </Flex.Item>
      <Trans>Executed</Trans>
    </Flex>
  </Tag>
);

const PendingStatusCell: FC = () => (
  <Tag color="processing">
    <Flex>
      <Flex.Item marginRight={1}>
        <Loading3QuartersOutlined />
      </Flex.Item>
      <Trans>Pending</Trans>
    </Flex>
  </Tag>
);

const LockedStatusCell: FC = () => (
  <Tag color="error">
    <Flex>
      <Flex.Item marginRight={1}>
        <LockOutlined />
      </Flex.Item>
      <Trans>Locked</Trans>
    </Flex>
  </Tag>
);

const QueuedStatusCell: FC = () => (
  <Tag color="warning">
    <Flex>
      <Flex.Item marginRight={1}>
        <ClockCircleOutlined />
      </Flex.Item>
      <Trans>Queued</Trans>
    </Flex>
  </Tag>
);

export const StatusCell: FC<StatusCellProps> = ({ status }) => (
  <Flex justify="flex-start">
    {status === OperationStatus.Executed && <ExecutedStatusCell />}
    {status === OperationStatus.Pending && <PendingStatusCell />}
    {status === OperationStatus.Locked && <LockedStatusCell />}
    {status === OperationStatus.Queued && <QueuedStatusCell />}
  </Flex>
);
