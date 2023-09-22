import { Button, Flex, Skeleton, Typography } from '@ergolabs/ui-kit';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC } from 'react';

import { SPECTRUM_DISCORD_LINK } from '../../common/constants/url.ts';
import { useObservable } from '../../common/hooks/useObservable.ts';
import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton.tsx';
import { Page } from '../../components/Page/Page.tsx';
import { rewards$ } from '../../network/cardano/api/rewards/rewards';
import { RewardsDashboard } from './RewardsDashboard/RewardsDashboard.tsx';

export const Rewards: FC = () => {
  const [rewardsData, loading] = useObservable(rewards$);

  return (
    <Page width={500}>
      <Flex col>
        <Flex.Item marginBottom={4} display="flex" justify="space-between">
          <Typography.Title level={4}>Rewards</Typography.Title>
          <Button href={SPECTRUM_DISCORD_LINK} target="_blank">
            Support
          </Button>
        </Flex.Item>
        <ConnectWalletButton
          width="100%"
          size="extra-large"
          trace={{
            element_location: ElementLocation.rewardsPage,
            element_name: ElementName.connectWalletButton,
          }}
        >
          {loading ? (
            <Skeleton active />
          ) : (
            rewardsData && <RewardsDashboard rewardsData={rewardsData} />
          )}
        </ConnectWalletButton>
      </Flex>
    </Page>
  );
};
