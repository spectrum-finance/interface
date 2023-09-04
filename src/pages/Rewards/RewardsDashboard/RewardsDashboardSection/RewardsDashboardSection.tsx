import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, ReactNode } from 'react';

import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon.tsx';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip.tsx';
import { TitledBox } from '../../../../components/TitledBox/TitledBox.tsx';
import { RewardSection } from '../../../../network/cardano/api/rewards/rewards';

interface RewardsDashboardSectionProps {
  readonly title: string;
  readonly tags?: Array<ReactNode>;
  readonly noCollectedRewardsNotification?: Array<ReactNode>;
  readonly infoTooltipText?: ReactNode | string;
  readonly data?: RewardSection;
}
export const RewardsDashboardSection: FC<RewardsDashboardSectionProps> = ({
  title,
  tags,
  noCollectedRewardsNotification,
  infoTooltipText,
  data,
}) => {
  return (
    <TitledBox
      secondary
      glass
      borderRadius="l"
      title={
        <Flex align="center">
          <Flex.Item>
            <Typography.Body strong>{title}</Typography.Body>
          </Flex.Item>
          {infoTooltipText && (
            <Flex.Item marginLeft={1}>
              <InfoTooltip content={infoTooltipText} />
            </Flex.Item>
          )}
        </Flex>
      }
      subtitle={
        <Flex>
          {tags &&
            tags.map((Tag, index) => {
              return (
                <Flex.Item
                  key={`reward-tag-item-${index}`}
                  marginRight={index === tags.length - 1 ? 0 : 1}
                >
                  {Tag}
                </Flex.Item>
              );
            })}
        </Flex>
      }
      titleGap={2}
      padding={3}
      isRowTitle
    >
      {data && data.collected ? (
        <Flex col>
          <Flex.Item display="flex" justify="space-between">
            <Typography.Body size="large">
              <Trans>Collected</Trans>
            </Typography.Body>
            <Flex align="center">
              <Flex.Item marginRight={1}>
                <AssetIcon asset={data.collected.asset} />
              </Flex.Item>

              <Typography.Body size="large" strong>
                {data.collected.toString()} {data.collected.asset.ticker}
              </Typography.Body>
            </Flex>
          </Flex.Item>
          {data.upcoming?.isPositive() && (
            <Flex.Item display="flex" justify="space-between" marginTop={2}>
              <Typography.Body size="large">
                <Trans>Upcoming</Trans>
              </Typography.Body>
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon asset={data.upcoming.asset} />
                </Flex.Item>

                <Typography.Body size="large" strong>
                  {data.upcoming.toString()} {data.upcoming.asset.ticker}
                </Typography.Body>
              </Flex>
            </Flex.Item>
          )}
        </Flex>
      ) : (
        <Flex col>
          {noCollectedRewardsNotification &&
            noCollectedRewardsNotification.map((Elem, index) => {
              return (
                <Flex.Item
                  key={`reward-tag-item-${index}`}
                  marginBottom={
                    index === noCollectedRewardsNotification.length - 1 ? 0 : 1
                  }
                >
                  {Elem}
                </Flex.Item>
              );
            })}
        </Flex>
      )}
    </TitledBox>
  );
};
