import { Flex, LoadingOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ClaimSpfReward } from '../../../../../../../network/ergo/api/claimSpf/claimSpfReward';
import { RewardInfo } from '../RewartInfo/RewardInfo';

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 80px;
  color: var(--spectrum-primary-color);
`;

export interface PendingStateProps {
  readonly reward: ClaimSpfReward;
  readonly dateTime: DateTime;
}

export const PendingState: FC<PendingStateProps> = ({ reward, dateTime }) => (
  <Flex col>
    <Flex.Item marginBottom={12}>
      <RewardInfo reward={reward} />
    </Flex.Item>
    <Flex.Item display="flex" justify="center" marginBottom={12}>
      <LoadingIcon />
    </Flex.Item>
    <Flex.Item marginBottom={4}>
      <Typography.Body>
        <Trans>You requested SPF reward on</Trans>{' '}
        {dateTime.toFormat('MMMM dd, yyyy hh:mm a')}{' '}
        <Trans>
          Your reward will come to your wallet within 24 hours from the moment
          the request was created. Thank you for being with us!”
        </Trans>
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
