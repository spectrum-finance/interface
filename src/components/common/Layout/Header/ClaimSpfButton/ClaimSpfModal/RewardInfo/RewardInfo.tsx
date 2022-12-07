import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { SpfReward } from '../../../../../../../network/ergo/api/spfFaucet/spfReward';
import { ClaimSpfStatusResponse } from '../../../../../../../network/ergo/api/spfFaucet/spfStatus';
import { RewardDetails } from './RewardDetails/RewardDetails';
import { RewardStatistic } from './RewardStatistic/RewardStatistic';

const ModalAccentBg = styled.div`
  background: var(--spectrum-claim-spf-background);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  height: 306px;
  position: absolute;
  transition: height 0.2s ease-in-out;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
`;

const StyledFlex = styled(Flex)`
  position: relative;
  z-index: 1;
`;

export interface RewardInfoProps {
  readonly reward: SpfReward;
  readonly status: ClaimSpfStatusResponse;
}

const BASE_HEIGHT = 346;
const ITEM_HEIGHT = 24;
const ITEM_PADDING = 8;

export const RewardInfo: FC<RewardInfoProps> = ({ reward, status }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const bgHeight = collapsed
    ? BASE_HEIGHT +
      reward.cohorts.length * ITEM_HEIGHT +
      reward.cohorts.length * ITEM_PADDING +
      2 * ITEM_PADDING
    : BASE_HEIGHT;

  return (
    <>
      <ModalAccentBg style={{ height: bgHeight }} />
      <StyledFlex col>
        <Flex.Item marginBottom={2}>
          <Typography.Title level={2}>
            {reward.total.toCurrencyString()}
          </Typography.Title>
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <RewardDetails
            collapsed={collapsed}
            reward={reward}
            onCollapsedChange={setCollapsed}
          />
        </Flex.Item>
        <RewardStatistic reward={reward} status={status} />
      </StyledFlex>
    </>
  );
};
