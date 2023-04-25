import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { SpfReward } from '../../../../../../../../network/ergo/api/spfFaucet/spfReward';
import {
  ClaimSpfStatusResponse,
  LAST_STAGE,
  SpfStatus,
} from '../../../../../../../../network/ergo/api/spfFaucet/spfStatus';

const StyledBox = styled(Box)`
  background: var(--spectrum-claim-spf-box-background);
  backdrop-filter: blur(4px);
  border-color: var(--spectrum-claim-spf-box-border-color);
`;

export interface RewardStatisticProps {
  readonly reward: SpfReward;
  readonly status: ClaimSpfStatusResponse;
}

export const RewardStatistic: FC<RewardStatisticProps> = ({
  reward,
  status,
}) => {
  const showAvailable =
    status.stage !== LAST_STAGE || status.status !== SpfStatus.Pending;
  const showNextReward = status.stage !== LAST_STAGE;

  return (
    <StyledBox borderRadius="l" padding={[2, 4]}>
      <Flex col>
        <Typography.Body size="small" secondary>
          <Trans>Claimed</Trans>
        </Typography.Body>
        <Flex.Item marginBottom={showAvailable ? 2 : 0}>
          <Typography.Title level={4}>
            {reward.claimed.toString()} / {reward.total.toCurrencyString()}
          </Typography.Title>
        </Flex.Item>
        {showAvailable && (
          <>
            <Typography.Body size="small" secondary>
              <Trans>Available for claiming</Trans>
            </Typography.Body>
            <Flex.Item marginBottom={showNextReward ? 2 : 0}>
              <Typography.Title level={4}>
                {status.stage === LAST_STAGE
                  ? reward.total.minus(reward.claimed).toCurrencyString()
                  : reward.available.toCurrencyString()}
              </Typography.Title>
            </Flex.Item>
          </>
        )}
        {showNextReward && (
          <>
            <Typography.Body size="small" secondary>
              {status.stage !== LAST_STAGE - 1 && t`Next reward`}
              {status.stage === LAST_STAGE - 1 && t`Final reward`}
            </Typography.Body>
            <Typography.Title level={4}>
              {status.nextStageDateTime.toFormat('DD')}
            </Typography.Title>
          </>
        )}
      </Flex>
    </StyledBox>
  );
};
