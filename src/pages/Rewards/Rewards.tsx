import {
  Alert,
  Button,
  Flex,
  InfoCircleFilled,
  Skeleton,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { filter } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { SPECTRUM_DISCORD_LINK } from '../../common/constants/url.ts';
import { useObservable } from '../../common/hooks/useObservable.ts';
import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton.tsx';
import { CopyButton } from '../../components/common/CopyButton/CopyButton.tsx';
import { Page } from '../../components/Page/Page.tsx';
import { getAddresses } from '../../gateway/api/addresses.ts';
import { rewards$ } from '../../network/cardano/api/rewards/rewards';
import { Eternl } from '../../network/cardano/api/wallet/eternl/eternl';
import { RewardsBugFixing } from './RewardsBugFixing/RewardsBugFixing';
import { RewardsDashboard } from './RewardsDashboard/RewardsDashboard.tsx';

export const Rewards: FC = () => {
  const [rewardsData, loading] = useObservable(rewards$);
  const [addresses] = useObservable(
    getAddresses().pipe(filter((addresses) => !!addresses?.length)),
  );

  return (
    <Flex col align="center">
      {applicationConfig.isRewardsAvailable && (
        <Flex.Item maxWidth={500} width="100%" marginBottom={3}>
          <Alert
            type="warning"
            description={
              <Flex>
                <Flex.Item marginRight={3}>
                  <InfoCircleFilled
                    style={{ color: 'var(--spectrum-warning-color)' }}
                  />
                </Flex.Item>
                <Flex.Item>
                  <Trans>
                    Some wallets do not provide our interface with complete
                    information about your ADA addresses so the reward can be
                    displayed inaccurately. If you are sure you are eligible for
                    any type of reward, try to recover your seed phrase using{' '}
                    <Button
                      type="link"
                      target="_blank"
                      href={Eternl.extensionLink}
                      style={{
                        height: 'auto',
                        padding: 0,
                        lineHeight: 0,
                        display: 'inline-block',
                      }}
                    >
                      Eternl
                    </Button>{' '}
                    wallet. If that doesn&apos;t work, contact{' '}
                    <Button
                      type="link"
                      target="_blank"
                      href={SPECTRUM_DISCORD_LINK}
                      style={{
                        height: 'auto',
                        lineHeight: 0,
                        padding: 0,
                        display: 'inline-block',
                      }}
                    >
                      support
                    </Button>
                    .
                  </Trans>
                </Flex.Item>
              </Flex>
            }
          />
        </Flex.Item>
      )}
      <Page width={500}>
        <Flex col>
          <Flex.Item marginBottom={4} display="flex" justify="space-between">
            <Typography.Title level={4}>Rewards</Typography.Title>
            {applicationConfig.isRewardsAvailable && (
              <Flex>
                {addresses && (
                  <Flex.Item marginRight={1}>
                    <CopyButton
                      text={addresses.reduce((acc, addr) => {
                        return `${acc}\n${addr},`;
                      }, '')}
                    >
                      <Trans>Copy</Trans>
                    </CopyButton>
                  </Flex.Item>
                )}
                <Flex.Item>
                  <Button
                    href={SPECTRUM_DISCORD_LINK}
                    size="small"
                    target="_blank"
                  >
                    <Trans>Support</Trans>
                  </Button>
                </Flex.Item>
              </Flex>
            )}
          </Flex.Item>
          {applicationConfig.isRewardsAvailable ? (
            <ConnectWalletButton width="100%" size="extra-large">
              {loading ? (
                <Skeleton active />
              ) : (
                rewardsData && <RewardsDashboard rewardsData={rewardsData} />
              )}
            </ConnectWalletButton>
          ) : (
            <RewardsBugFixing />
          )}
        </Flex>
      </Page>
    </Flex>
  );
};
