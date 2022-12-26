import {
  Box,
  Button,
  Flex,
  SwapRightOutlined,
  Tag,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../../../common/models/AmmPool';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { AssetIconPair } from '../../../../components/AssetIconPair/AssetIconPair';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { LineProgress } from '../../LineProgress/LineProgress';

export const FarmHeaderAssets = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
`;

interface FarmCardHeader {
  className?: string;
  assetX: any;
  assetY: any;
}

const _FarmCardHeader: React.FC<FarmCardHeader> = ({
  className,
  assetX,
  assetY,
}) => {
  return (
    <Flex className={className} justify="space-between">
      <Flex col align="flex-start">
        <Typography.Text>
          <Trans>Total Staked</Trans>
        </Typography.Text>
        <DataTag content="$---" />
      </Flex>
      <Flex col align="flex-end">
        <Typography.Text>
          <Trans>Your Stake</Trans>
        </Typography.Text>
        <DataTag content="$---" />
      </Flex>
      <FarmHeaderAssets>
        <AssetIconPair assetX={assetX} assetY={assetY} size="extraLarge" />
      </FarmHeaderAssets>
    </Flex>
  );
};

export const FarmCardHeader = styled(_FarmCardHeader)`
  position: relative;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: linear-gradient(180deg, #764ca3 0%, #677de7 100%);
  padding: 16px;
  margin: -16px -16px 32px;
  height: 104px;
`;

interface FarmCardViewProps {
  item: AmmPool;
}

export const FarmCardView: React.FC<FarmCardViewProps> = ({ item }) => {
  return (
    <Box padding={4} style={{ background: 'var(--spectrum-body-bg)' }}>
      <FarmCardHeader assetX={item.x.asset} assetY={item.y.asset} />
      <Flex col style={{ textAlign: 'center' }}>
        <Typography.Title level={5}>
          <Trans>
            Deposit {item.x.asset.ticker}/{item.y.asset.ticker} and earn{' '}
            {item.y.asset.ticker}
          </Trans>
        </Typography.Title>
        <Flex.Item align="center" col marginTop={1} marginBottom={4}>
          <Tag color="orange">Scheduled</Tag>
        </Flex.Item>

        <Flex.Item
          justify="space-between"
          align="center"
          marginTop={2}
          marginBottom={2}
        >
          <Typography.Body secondary style={{ fontSize: 12 }}>
            <InfoTooltip
              secondary
              width={194}
              placement="top"
              content={
                <Trans>
                  345 {item.x.asset.ticker} out of 1000 {item.x.asset.ticker}{' '}
                  have already been distributed
                </Trans>
              }
            >
              Distributed
            </InfoTooltip>
            :
          </Typography.Body>

          <LineProgress percent={60} height={24} width="130px" />
        </Flex.Item>

        <Flex.Item
          justify="space-between"
          align="center"
          marginTop={2}
          marginBottom={2}
        >
          <Typography.Body secondary style={{ fontSize: 12 }}>
            APY:
          </Typography.Body>
          <Flex gap={0.5} align="center">
            <AssetIcon size="extraSmall" asset={item.y.asset} />
            <Typography.Body style={{ fontSize: 12 }}>0.5%</Typography.Body>
          </Flex>
        </Flex.Item>
        <Flex.Item
          justify="space-between"
          align="center"
          marginTop={2}
          marginBottom={2}
        >
          <Typography.Body secondary style={{ fontSize: 12 }}>
            Live period:
          </Typography.Body>
          <Typography.Body style={{ fontSize: 12 }}>
            2022-07-20{' '}
            <SwapRightOutlined
              size={12}
              style={{
                color: 'var(--spectrum-disabled-text-contrast)',
              }}
            />{' '}
            2022-08-20
          </Typography.Body>
        </Flex.Item>
        <Flex.Item
          justify="space-between"
          align="center"
          marginTop={2}
          marginBottom={2}
        >
          <Typography.Body secondary style={{ fontSize: 12 }}>
            Distribution frequency:
          </Typography.Body>
          <Typography.Body style={{ fontSize: 12 }}>
            30 days (134,567 blocks)
          </Typography.Body>
        </Flex.Item>
        <Flex.Item
          justify="space-between"
          align="center"
          marginTop={2}
          marginBottom={2}
        >
          <Typography.Body secondary style={{ fontSize: 12 }}>
            Next rewards:
          </Typography.Body>
          <Typography.Body style={{ fontSize: 12 }}>
            You need to wait until 2022-07-20
          </Typography.Body>
        </Flex.Item>
        <Flex.Item
          justify="space-between"
          align="center"
          marginTop={2}
          marginBottom={2}
          gap={0.5}
        >
          <Typography.Body secondary style={{ fontSize: 12 }}>
            Rewards:
          </Typography.Body>
          <Typography.Body style={{ fontSize: 12 }}>
            You need to wait until 2022-07-20
          </Typography.Body>
        </Flex.Item>
        <Flex.Item marginTop="auto">
          <Button type="primary" size="large" block>
            Stake
          </Button>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
