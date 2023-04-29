import { Flex, LoadingOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { SpfReward } from '../../../../../../../network/ergo/api/spfFaucet/spfReward';
import { ClaimSpfStatusResponse } from '../../../../../../../network/ergo/api/spfFaucet/spfStatus';
import { RewardInfo } from '../RewardInfo/RewardInfo';

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 80px;
  color: var(--spectrum-primary-color);
`;

export interface PendingStateProps {
  readonly reward: SpfReward;
  readonly status: ClaimSpfStatusResponse;
}

export const PendingState: FC<PendingStateProps> = ({ reward, status }) => (
  <Flex col>
    <Flex.Item marginBottom={12}>
      <RewardInfo reward={reward} status={status} />
    </Flex.Item>
    <Flex.Item display="flex" justify="center" marginBottom={4}>
      <LoadingIcon />
    </Flex.Item>
    <Flex.Item display="flex" justify="center">
      <Typography.Body size="small" secondary align="center">
        <Trans>Pending amount</Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item display="flex" justify="center" marginBottom={8}>
      <Typography.Title level={4}>
        {reward.pending.toCurrencyString()}
      </Typography.Title>
    </Flex.Item>
    <Flex.Item marginBottom={4}>
      <Typography.Body>
        <Trans>You requested SPF reward on</Trans>{' '}
        {status.dateTime.toFormat('MMMM dd, yyyy hh:mm a')}.{' '}
        <Trans>
          Your reward will come to your wallet within 24 hours from the moment
          the request was created. Thank you for being with us!
        </Trans>
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
