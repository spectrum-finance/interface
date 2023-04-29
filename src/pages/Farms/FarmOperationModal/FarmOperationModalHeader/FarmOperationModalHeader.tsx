import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import * as React from 'react';
import styled from 'styled-components';

import { Farm, FarmStatus } from '../../../../common/models/Farm';
import { AssetIconPair } from '../../../../components/AssetIconPair/AssetIconPair';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { FarmHeaderAssets } from '../../FarmGridView/FarmCardView/FarmCardView';

interface FarmActionModalHeaderProps {
  readonly className?: string;
  readonly farm: Farm;
  readonly operation: 'withdrawal' | 'stake';
}

const WhiteText = styled(Typography.Body)`
  color: var(--spectrum-text-white) !important;
`;

const _FarmActionModalHeader: React.FC<FarmActionModalHeaderProps> = ({
  className,
  farm,
  operation,
}) => {
  return (
    <Flex className={className} col gap={8}>
      {operation === 'stake' ? t`Stake` : t`Unstake`}{' '}
      {farm.totalStakedX.asset.ticker}/{farm.totalStakedY.asset.ticker}{' '}
      liquidity
      <Flex justify="space-between">
        <Flex col align="flex-start">
          <Flex.Item marginBottom={0.5}>
            <WhiteText>
              <Trans>Total Staked</Trans>
            </WhiteText>
          </Flex.Item>
          <Box borderRadius="s" bordered={false} padding={[0, 1]}>
            <Typography.Body strong size="large">
              <Flex gap={1} align="center">
                <ConvenientAssetView value={farm.totalStakedShares} />
                <InfoTooltip
                  width={194}
                  size="small"
                  placement="top"
                  icon="exclamation"
                  content={
                    <>
                      {farm.totalStakedX.asset.ticker}:{' '}
                      {farm.totalStakedX.toString()}
                      <br />
                      {farm.totalStakedY.asset.ticker}:{' '}
                      {farm.totalStakedY.toString()}
                    </>
                  }
                />
              </Flex>
            </Typography.Body>
          </Box>
        </Flex>
        <Flex col align="flex-end">
          <Flex.Item marginBottom={0.5}>
            <WhiteText>
              <Trans>APR</Trans>
            </WhiteText>
          </Flex.Item>
          <Box borderRadius="s" bordered={false} padding={[0, 1]}>
            <Typography.Body strong size="large">
              {farm.status !== FarmStatus.Live && '––'}
              {farm.status === FarmStatus.Live && farm.apr && `${farm.apr}%`}
              {farm.status === FarmStatus.Live && !farm.apr && `< 0.01%`}
            </Typography.Body>
          </Box>
        </Flex>
        <FarmHeaderAssets>
          <AssetIconPair
            assetX={farm.totalStakedX.asset}
            assetY={farm.totalStakedY.asset}
            size="extraLarge"
          />
        </FarmHeaderAssets>
      </Flex>
    </Flex>
  );
};

export const FarmOperationModalHeader = styled(_FarmActionModalHeader)`
  position: relative;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background: linear-gradient(180deg, #764ca3 0%, #677de7 100%) !important;
  padding: 24px;
  margin: -16px -16px 32px;
  height: 164px;
  color: var(--spectrum-text-white);
`;
