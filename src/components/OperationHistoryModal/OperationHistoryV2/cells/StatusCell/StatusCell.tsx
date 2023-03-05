import {
  CheckOutlined,
  ClockCircleOutlined,
  Flex,
  LoadingOutlined,
  LockOutlined,
  Spin,
  Tag,
  Tooltip,
  UndoOutlined,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { OperationStatus } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { OperationItem } from '../../../../../network/ergo/api/operations/history/v2/types/OperationItem';

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

const NeedRefundStatusCell: FC = () => (
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
        <Trans>Need refund</Trans>
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
    <Tag color="processing">
      <Flex>
        <Flex.Item marginRight={1}>
          <ClockCircleOutlined />
        </Flex.Item>
        <Trans>Queued</Trans>
      </Flex>
    </Tag>
  </Tooltip>
);

const RefundedStatusCell: FC = () => (
  <Tag color="warning">
    <Flex>
      <Flex.Item marginRight={1}>
        <UndoOutlined />
      </Flex.Item>
      <Trans>Refunded</Trans>
    </Flex>
  </Tag>
);

export const StatusCell: FC<StatusCellProps> = ({ operationItem }) => (
  <Flex justify="flex-start">
    {operationItem.status === OperationStatus.Evaluated && (
      <EvaluatedStatusCell />
    )}
    {operationItem.status === OperationStatus.Pending && <PendingStatusCell />}
    {operationItem.status === OperationStatus.NeedRefund && (
      <NeedRefundStatusCell />
    )}
    {operationItem.status === OperationStatus.Refunded && (
      <RefundedStatusCell />
    )}
    {operationItem.status === OperationStatus.Queued && <QueuedStatusCell />}
  </Flex>
);
