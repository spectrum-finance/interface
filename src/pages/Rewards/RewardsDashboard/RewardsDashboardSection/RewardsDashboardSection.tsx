import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, ReactNode } from 'react';

import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip.tsx';
import { RewardSection } from '../../../../network/cardano/api/rewards/rewards';

interface RewardsDashboardSectionTagsProps {
  readonly tags: ReactNode[];
}

const RewardsDashboardSectionTags: FC<RewardsDashboardSectionTagsProps> = ({
  tags,
}) => (
  <Flex>
    {tags.map((tag, index) => {
      return (
        <Flex.Item
          key={`reward-tag-item-${index}`}
          marginRight={index === tags.length - 1 ? 0 : 1}
        >
          {tag}
        </Flex.Item>
      );
    })}
  </Flex>
);

interface RewardsDashboardSectionProps {
  readonly title: string | ReactNode | ReactNode[];
  readonly tags?: ReactNode[];
  readonly noCollectedRewardsNotification?: ReactNode[];
  readonly infoTooltipText?: ReactNode | string;
  readonly upcomingTooltipText?: ReactNode | string;
  readonly infoTooltipWidth?: number;
  readonly button?: ReactNode;
  readonly data: RewardSection | undefined;
}
export const RewardsDashboardSection: FC<RewardsDashboardSectionProps> = ({
  title,
  tags,
  noCollectedRewardsNotification,
  infoTooltipText,
  infoTooltipWidth,
  upcomingTooltipText,
  button,
  data,
}) => {
  return (
    <Flex col>
      <Flex.Item
        display="flex"
        align="center"
        justify="space-between"
        marginBottom={2}
      >
        <Flex>
          <InfoTooltip
            disabled={!infoTooltipText}
            content={infoTooltipText}
            isQuestionIcon
            width={infoTooltipWidth}
          >
            <Typography.Body strong>{title}</Typography.Body>
          </InfoTooltip>

          {button && <Flex.Item marginLeft={1}>{button}</Flex.Item>}
        </Flex>
        {tags && <RewardsDashboardSectionTags tags={tags} />}
      </Flex.Item>
      {!data && noCollectedRewardsNotification?.length && (
        <Flex col>
          {noCollectedRewardsNotification.map((notification, index) => (
            <Flex.Item
              key={`reward-notification-item-${index}`}
              marginBottom={
                index !== noCollectedRewardsNotification?.length - 1 ? 2 : 0
              }
            >
              {notification}
            </Flex.Item>
          ))}
        </Flex>
      )}
      {data && (
        <Box borderRadius="l" bordered padding={3}>
          <Flex col>
            <Flex.Item marginBottom={2} justify="space-between">
              <Typography.Title level={5}>
                <Trans>Available</Trans>
              </Typography.Title>
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon asset={data.available.asset} />
                </Flex.Item>

                <Typography.Body size="large" strong>
                  {data.available.toString()} {data.available.asset.ticker}
                </Typography.Body>
              </Flex>
            </Flex.Item>
            {data.upcoming && (
              <Flex.Item marginBottom={2} justify="space-between">
                <Typography.Title level={5}>
                  <InfoTooltip
                    isQuestionIcon
                    content={upcomingTooltipText}
                    width={190}
                  >
                    <Trans>Upcoming</Trans>
                  </InfoTooltip>
                </Typography.Title>
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
            <Flex.Item justify="space-between">
              <Typography.Title level={5}>
                <Trans>Claimed</Trans>
              </Typography.Title>
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon asset={data.claimed.asset} />
                </Flex.Item>

                <Typography.Body size="large" strong>
                  {data.claimed.toString()} {data.claimed.asset.ticker}
                </Typography.Body>
              </Flex>
            </Flex.Item>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};
