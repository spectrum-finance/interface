import {
  CheckOutlined,
  ClockCircleOutlined,
  Flex,
  LoadingOutlined,
  LockOutlined,
  Spin,
  Tag,
  Tooltip,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

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

const StyledSpin = styled(Spin)`
  color: var(--spectrum-blue-color);
  font-size: 12px;

  .anticon {
    font-size: 12px;
  }
`;

const PendingStatusCell: FC = () => (
  <Tag color="processing">
    <Flex>
      <Flex.Item marginRight={1}>
        <StyledSpin indicator={<LoadingOutlined />} />
      </Flex.Item>
      <Trans>Pending</Trans>
    </Flex>
  </Tag>
);

const LockedStatusCell: FC = () => (
  <Tooltip
    width={255}
    title={
      <Trans>
        Your transaction was locked in the smart contract. Don’t worry you just
        need to refund it.
      </Trans>
    }
  >
    <Tag color="error">
      <Flex>
        <Flex.Item marginRight={1}>
          <LockOutlined />
        </Flex.Item>
        <Trans>Locked</Trans>
      </Flex>
    </Tag>
  </Tooltip>
);

const QueuedStatusCell: FC = () => (
  <Tooltip
    width={255}
    title={
      <Trans>
        The price has changed while your order was being processed. So we didn’t
        execute it to prevent losses.
      </Trans>
    }
  >
    <Tag color="warning">
      <Flex>
        <Flex.Item marginRight={1}>
          <ClockCircleOutlined />
        </Flex.Item>
        <Trans>Queued</Trans>
      </Flex>
    </Tag>
  </Tooltip>
);

export const StatusCell: FC<StatusCellProps> = ({ status }) => (
  <Flex justify="flex-start">
    {status === OperationStatus.Executed && <ExecutedStatusCell />}
    {status === OperationStatus.Pending && <PendingStatusCell />}
    {status === OperationStatus.Locked && <LockedStatusCell />}
    {status === OperationStatus.Queued && <QueuedStatusCell />}
  </Flex>
);
