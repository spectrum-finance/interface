import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { LiquidityPoolOrPositionDetailsProps } from '../../../common/types/LiquidityPoolOrPositionDetailsProps';

export const PoolOrPositionDetails: FC<
  LiquidityPoolOrPositionDetailsProps<any>
> = ({ poolMapper, item, children }) => {
  const navigate = useNavigate();

  const overviewPool = () => navigate(poolMapper(item).id);

  const navigateToSwap = () => navigate('../../swap');

  return (
    <Flex stretch align="center">
      <Flex.Item marginRight={6}>
        <Flex col>
          <Typography.Footnote>
            <Trans>Total liquidity</Trans>
          </Typography.Footnote>
          <Typography.Body strong>
            {poolMapper(item).x.asset.ticker}: {poolMapper(item).x.toString()}
          </Typography.Body>
          <Typography.Body strong>
            {poolMapper(item).y.asset.ticker}: {poolMapper(item).y.toString()}
          </Typography.Body>
        </Flex>
      </Flex.Item>
      {children && <Flex.Item marginRight={6}>{children}</Flex.Item>}
      <Flex.Item flex={1}>
        <Flex col>
          <Typography.Footnote>
            <Trans>Price</Trans>
          </Typography.Footnote>
          <Typography.Body strong>
            {poolMapper(item).xRatio.toString()}{' '}
            {poolMapper(item).xRatio.baseAsset.ticker}/
            {poolMapper(item).xRatio.quoteAsset.ticker}
          </Typography.Body>
          <Typography.Body strong>
            {poolMapper(item).yRatio.toString()}{' '}
            {poolMapper(item).yRatio.baseAsset.ticker}/
            {poolMapper(item).yRatio.quoteAsset.ticker}
          </Typography.Body>
        </Flex>
      </Flex.Item>
      <Flex.Item display="flex">
        <Flex.Item marginRight={2}>
          <ConnectWalletButton analytics={{ location: 'pool-list' }}>
            <Button onClick={navigateToSwap}>
              <Trans>Swap</Trans>
            </Button>
          </ConnectWalletButton>
        </Flex.Item>
        <Button type="primary" onClick={overviewPool}>
          <Trans>Pool Overview</Trans>
        </Button>
      </Flex.Item>
    </Flex>
  );
};
