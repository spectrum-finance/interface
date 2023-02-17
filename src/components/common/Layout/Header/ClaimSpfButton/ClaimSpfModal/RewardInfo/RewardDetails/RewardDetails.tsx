import {
  Collapse,
  DownOutlined,
  Flex,
  Typography,
  UpOutlined,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { SpfReward } from '../../../../../../../../network/ergo/api/spfFaucet/spfReward';

interface ProgressHeaderChevronProps {
  collapsed?: boolean;
}

const ProgressHeaderChevron: FC<ProgressHeaderChevronProps> = ({
  collapsed,
}) => (
  <Typography.Body>
    {collapsed ? <UpOutlined /> : <DownOutlined />}
  </Typography.Body>
);

export interface RewardDetails {
  readonly reward: SpfReward;
  readonly className?: string;
  readonly collapsed?: boolean;
  readonly onCollapsedChange: (collapsed: boolean) => void;
}

const mapCohortNameToCaption = {
  traders: t`Trader:`,
  betaTesters: t`Beta tester:`,
  liquidityProviders: t`Liquidity provider:`,
  nft: t`Nft`,
  earlyOffChainOperators: t`Early off-chain operator:`,
  offChainOperators: t`Off-chain operator:`,
};

const _RewardDetails: FC<RewardDetails> = ({
  reward,
  className,
  onCollapsedChange,
  collapsed,
}) => (
  <Collapse
    className={className}
    onChange={(keys) => onCollapsedChange(keys.length > 0)}
  >
    <Collapse.Panel
      key="details"
      header={
        <Flex justify="space-between" align="center" width="100%">
          <Typography.Body size="large" strong>
            <Trans>Reward details</Trans>
          </Typography.Body>
          <ProgressHeaderChevron collapsed={collapsed} />
        </Flex>
      }
      showArrow={false}
    >
      {reward.cohorts.map((c, i) => (
        <Flex.Item
          display="flex"
          justify="space-between"
          marginBottom={2}
          key={i}
        >
          <Typography.Body size="large">
            {/*@ts-ignore*/}
            {mapCohortNameToCaption[c.cohort]}
          </Typography.Body>
          <Typography.Body strong size="large">
            {c.spfReward.toCurrencyString()}
          </Typography.Body>
        </Flex.Item>
      ))}
    </Collapse.Panel>
  </Collapse>
);

export const RewardDetails = styled(_RewardDetails)`
  background: var(--spectrum-claim-spf-box-background) !important;
  backdrop-filter: blur(4px);
  border: 1px solid var(--spectrum-claim-spf-box-border-color) !important;

  .ant-collapse-content {
    background: transparent !important;
  }

  .ant-collapse-item .ant-collapse-header {
    padding: 0.5rem 1rem !important;
  }

  .ant-collapse-item .ant-collapse-content-box {
    padding: 0.5rem 1rem !important;
  }

  .ant-collapse-header-text {
    width: 100%;
  }
`;
