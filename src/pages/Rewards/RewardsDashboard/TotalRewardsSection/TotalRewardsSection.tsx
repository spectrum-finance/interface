import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { Currency } from '../../../../common/models/Currency.ts';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon.tsx';
import { ShareXButton } from '../../../../components/ShareXButton/ShareXButton.tsx';
import { TitledBox } from '../../../../components/TitledBox/TitledBox.tsx';

interface TotalRewardsSectionProps {
  readonly totalCollectedRewards: Currency;
}
export const TotalRewardsSection: FC<TotalRewardsSectionProps> = ({
  totalCollectedRewards,
}) => {
  return (
    <TitledBox
      secondary
      glass
      borderRadius="l"
      title={
        <Typography.Body strong>
          <Trans>Total Rewards Collected</Trans>
        </Typography.Body>
      }
      titleGap={2}
      padding={3}
    >
      <Flex justify="space-between">
        <Flex.Item display="flex" align="center">
          <Flex.Item marginRight={2}>
            <AssetIcon asset={totalCollectedRewards.asset} />
          </Flex.Item>
          <Typography.Title level={2}>
            {totalCollectedRewards.toString()}{' '}
            {totalCollectedRewards.asset.ticker}
          </Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <ShareXButton totalSpfReward={totalCollectedRewards.toString()} />
        </Flex.Item>
      </Flex>
    </TitledBox>
  );
};
