import {
  Alert,
  Button,
  Divider,
  Flex,
  Modal,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { SPF0_URL, SPF1_URL } from '../../../common/constants/ispo.ts';
import { LbspCalculatorModal } from '../../../components/LbspCalculatorModal/LbspCalculatorModal';
import { RewardsData } from '../../../network/cardano/api/rewards/rewards';
import { RewardInfoTag } from '../Tags/RewardInfoTag/RewardInfoTag.tsx';
import { RewardStatusTag } from '../Tags/RewardStatusTag/RewardStatusTag.tsx';
import { ClaimRewardsButton } from './ClaimRewardsButton/ClaimRewardsButton.tsx';
import { RewardsDashboardSection } from './RewardsDashboardSection/RewardsDashboardSection.tsx';
import { TotalRewardsSection } from './TotalRewardsSection/TotalRewardsSection.tsx';

export interface RewardsDashboardProps {
  readonly rewardsData: RewardsData;
}

export const RewardsDashboard: FC<RewardsDashboardProps> = ({
  rewardsData,
}) => (
  <Flex col>
    <Flex.Item marginBottom={4}>
      <RewardsDashboardSection
        title={t`LBSP`}
        tags={[
          <RewardInfoTag key="reward-info-tag-lbsp" />,
          <RewardStatusTag key="reward-status-tag-lbsp" status="ongoing" />,
        ]}
        noCollectedRewardsNotification={[
          <Alert
            key="lbsp-alert-1"
            type="warning"
            showIcon
            message={
              <Trans>
                You do not provide liquidity to the Spectrum Cardano protocol.
                Provide liquidity to generate LBSP rewards.
              </Trans>
            }
          />,
          <Alert
            key="lbsp-alert-2"
            type="info"
            showIcon
            message={
              <Trans>LBSP rewards are 50% higher then the ISPO ones</Trans>
            }
          />,
          <Button
            key="lbsp-alert-3"
            type="primary"
            size="large"
            width="100%"
            onClick={() =>
              Modal.open(({ close }) => <LbspCalculatorModal close={close} />)
            }
          >
            <Trans>Provide liquidity</Trans>
          </Button>,
        ]}
        data={rewardsData.lbspRewards}
      />
    </Flex.Item>

    <Flex.Item marginBottom={4}>
      <RewardsDashboardSection
        title={t`ISPO`}
        tags={[
          <RewardStatusTag key="reward-status-tag-ispo" status="ongoing" />,
        ]}
        noCollectedRewardsNotification={[
          <Alert
            key="ispo-alert-1"
            type="warning"
            showIcon
            message={
              <Trans>
                You do not stake ADA in the ISPO. Official ISPO stake pools are{' '}
                <Typography.Link href={SPF0_URL} target="_blank">
                  SPF0
                </Typography.Link>{' '}
                and{' '}
                <Typography.Link href={SPF1_URL} target="_blank">
                  SPF1
                </Typography.Link>
                . Use your wallet to delegate ADA to one of those stake pools
                and receive 0.006 SPF per delegated ADA epochly.
              </Trans>
            }
          />,
        ]}
        data={rewardsData.ispoRewards}
      />
    </Flex.Item>
    <Flex.Item marginBottom={4}>
      <RewardsDashboardSection
        title={t`Airdrop`}
        tags={[
          <RewardStatusTag key="reward-status-tag-airdrop" status="finished" />,
        ]}
        noCollectedRewardsNotification={[
          <Alert
            key="airdrop-alert"
            type="info"
            showIcon
            message={
              <Trans>
                You are not eligible for airdrop rewards. Provide liquidity or
                stake ADA in the ISPO to get rewarded.
              </Trans>
            }
          />,
        ]}
        data={rewardsData.airdropRewards}
      />
    </Flex.Item>
    <Flex.Item marginBottom={4}>
      <Divider />
    </Flex.Item>
    <Flex.Item marginBottom={4}>
      <TotalRewardsSection totalCollectedRewards={rewardsData.totalCollected} />
    </Flex.Item>
    <Flex.Item width="100%">
      <ClaimRewardsButton />
    </Flex.Item>
  </Flex>
);
