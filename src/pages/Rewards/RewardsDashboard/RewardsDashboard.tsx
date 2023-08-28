import { Alert, Divider, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';

import { SPF0_URL, SPF1_URL } from '../../../common/constants/ispo.ts';
import { useObservable } from '../../../common/hooks/useObservable.ts';
import { userRewards$ } from '../../../network/cardano/api/rewards/rewards.ts';
import { RewardInfoTag } from '../Tags/RewardInfoTag/RewardInfoTag.tsx';
import { RewardStatusTag } from '../Tags/RewardStatusTag/RewardStatusTag.tsx';
import { ClaimRewardsButton } from './ClaimRewardsButton/ClaimRewardsButton.tsx';
import { RewardsDashboardSection } from './RewardsDashboardSection/RewardsDashboardSection.tsx';
import { TotalRewardsSection } from './TotalRewardsSection/TotalRewardsSection.tsx';

export const RewardsDashboard = () => {
  const [rewards, isLoading] = useObservable(userRewards$);
  console.log('here2', rewards);

  return (
    <>
      {!isLoading && rewards ? (
        <Flex col>
          <Flex.Item marginBottom={4}>
            <RewardsDashboardSection
              title={t`LBSP`}
              tags={[
                <RewardInfoTag key="reward-info-tag-lbsp" />,
                <RewardStatusTag
                  key="reward-status-tag-lbsp"
                  status="ongoing"
                />,
              ]}
              data={rewards.lbspRewards}
            />
          </Flex.Item>

          <Flex.Item marginBottom={4}>
            <RewardsDashboardSection
              title={t`ISPO`}
              tags={[
                <RewardStatusTag
                  key="reward-status-tag-ispo"
                  status="ongoing"
                />,
              ]}
              noCollectedRewardsNotification={[
                <Alert
                  key="ispo-alert-1"
                  type="warning"
                  showIcon
                  message={
                    <Trans>
                      You do not stake ADA in the ISPO. Official ISPO stake
                      pools are{' '}
                      <Typography.Link href={SPF0_URL} target="_blank">
                        SPF0
                      </Typography.Link>{' '}
                      and{' '}
                      <Typography.Link href={SPF1_URL} target="_blank">
                        SPF1
                      </Typography.Link>
                      . Use your wallet to delegate ADA to one of those stake
                      pools and receive 0.006 SPF per delegated ADA epochly.
                    </Trans>
                  }
                />,
              ]}
              data={rewards.ispoRewards}
            />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <RewardsDashboardSection
              title={t`Airdrop`}
              tags={[
                <RewardStatusTag
                  key="reward-status-tag-airdrop"
                  status="finished"
                />,
              ]}
              noCollectedRewardsNotification={[
                <Alert
                  key="airdrop-alert"
                  type="info"
                  showIcon
                  message={t`You are not eligible for airdrop rewards. Provide liquidity or
                  stake ADA in the ISPO to get rewarded.`}
                />,
              ]}
              data={rewards.airdropRewards}
            />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Divider />
          </Flex.Item>
          {rewards.totalCollected && (
            <Flex.Item marginBottom={4}>
              <TotalRewardsSection
                totalCollectedRewards={rewards.totalCollected}
              />
            </Flex.Item>
          )}
          <Flex.Item width="100%">
            <ClaimRewardsButton />
          </Flex.Item>
        </Flex>
      ) : (
        <Typography.Body>Loading..</Typography.Body>
      )}
    </>
  );
};
