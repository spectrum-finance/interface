import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { LmPool, LmPoolStatus } from '../../../../common/models/LmPool';
import { AssetIconPair } from '../../../../components/AssetIconPair/AssetIconPair';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { FarmHeaderAssets } from '../../FarmGridView/FarmCardView/FarmCardView';

interface FarmActionModalHeaderProps {
  className?: string;
  assetX: AssetInfo;
  assetY: AssetInfo;
  lmPool: LmPool;
}

const WhiteText = styled(Typography.Text)`
  color: var(--spectrum-text-white) !important;
`;

const _FarmActionModalHeader: React.FC<FarmActionModalHeaderProps> = ({
  className,
  assetX,
  assetY,
  lmPool,
}) => {
  return (
    <Flex className={className} col gap={8}>
      Stake {assetX.ticker}/{assetY.ticker} liquidity
      <Flex justify="space-between">
        <Flex col align="flex-start">
          <WhiteText>
            <Trans>Total Staked</Trans>
          </WhiteText>
          <DataTag
            content={
              <Flex gap={1} align="center">
                {/* ${lmPool.shares}{' '} */}
                <InfoTooltip
                  width={194}
                  size="small"
                  placement="top"
                  icon="exclamation"
                  content={
                    <div>
                      <div>
                        {lmPool.totalStakedX.asset.ticker}:{' '}
                        {lmPool.totalStakedX.toString()}
                      </div>
                      <div>
                        {lmPool.totalStakedY.asset.ticker}:{' '}
                        {lmPool.totalStakedY.toString()}
                      </div>
                    </div>
                  }
                />
              </Flex>
            }
          />
        </Flex>
        {lmPool.status === LmPoolStatus.Live && (
          <Flex col align="flex-end">
            <WhiteText>
              <Trans>APR</Trans>
            </WhiteText>
            {/*<APRComponent lmPool={lmPool} />*/}
          </Flex>
        )}

        <FarmHeaderAssets>
          <AssetIconPair assetX={assetX} assetY={assetY} size="extraLarge" />
        </FarmHeaderAssets>
      </Flex>
    </Flex>
  );
};

export const FarmActionModalHeader = styled(_FarmActionModalHeader)`
  position: relative;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background: linear-gradient(180deg, #764ca3 0%, #677de7 100%) !important;
  padding: 24px;
  margin: -16px -16px 32px;
  height: 164px;
  color: var(--spectrum-text-white);
`;
