import { Divider, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { SpfReward } from '../../../../../../../network/ergo/api/spfFaucet/spfReward';

const ModalAccentBg = styled.div`
  background: var(--spectrum-claim-spf-background);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  height: 306px;
  position: absolute;
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
}

const mapCohortNameToCaption = {
  traders: t`Trader:`,
  betaTesters: t`Beta tester:`,
  liquidityProviders: t`Liquidity provider:`,
  nft: t`Nft`,
  earlyOffChainOperators: t`Early off-chain operator:`,
  offChainOperators: t`Off-chain operator:`,
};

const BASE_HEIGHT = 138;
const ITEM_HEIGHT = 24;
const ITEM_PADDING = 8;

export const RewardInfo: FC<RewardInfoProps> = ({ reward }) => {
  const bgHeight =
    BASE_HEIGHT +
    reward.cohorts.length * ITEM_HEIGHT +
    reward.cohorts.length * ITEM_PADDING +
    ITEM_PADDING;

  return (
    <>
      <ModalAccentBg style={{ height: bgHeight }} />
      <StyledFlex col>
        <Flex.Item
          display="flex"
          justify="space-between"
          marginBottom={2}
          marginTop={4}
        >
          <Typography.Title>{reward.total.toString()}</Typography.Title>
          <Typography.Title>SPF</Typography.Title>
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <Divider />
        </Flex.Item>
        {reward.cohorts.map((c, i) => (
          <Flex.Item
            display="flex"
            justify="space-between"
            marginBottom={i === reward.cohorts.length - 1 ? 4 : 2}
            key={i}
          >
            <Typography.Body strong size="large">
              {/*@ts-ignore*/}
              {mapCohortNameToCaption[c.cohort]}
            </Typography.Body>
            <Typography.Body strong size="large">
              {c.spfReward.toCurrencyString()}
            </Typography.Body>
          </Flex.Item>
        ))}
      </StyledFlex>
    </>
  );
};
