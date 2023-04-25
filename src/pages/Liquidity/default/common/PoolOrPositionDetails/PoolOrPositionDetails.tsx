import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { LiquidityPoolOrPositionDetailsProps } from '../../../common/types/LiquidityPoolOrPositionDetailsProps';

export const PoolOrPositionDetails: FC<
  LiquidityPoolOrPositionDetailsProps<any>
> = ({ poolMapper, item, children }) => {
  const navigate = useNavigate();

  const pool = poolMapper(item);

  const overviewPool = () => navigate(pool.id);

  const navigateToSwap = () =>
    navigate(
      `../../swap?base=${pool.x.asset.id}&quote=${pool.y.asset.id}&initialPoolId=${pool.id}`,
    );

  return (
    <Flex stretch align="center">
      <Flex.Item marginRight={6}>
        <Flex col>
          <Typography.Body size="small" secondary>
            <Trans>Total liquidity</Trans>
          </Typography.Body>
          <Typography.Body strong>
            {pool.x.asset.ticker}: {poolMapper(item).x.toString()}
          </Typography.Body>
          <Typography.Body strong>
            {pool.y.asset.ticker}: {poolMapper(item).y.toString()}
          </Typography.Body>
        </Flex>
      </Flex.Item>
      {children && <Flex.Item marginRight={6}>{children}</Flex.Item>}
      <Flex.Item flex={1}>
        <Flex col>
          <Typography.Body size="small" secondary>
            <Trans>Price</Trans>
          </Typography.Body>
          <Typography.Body strong>
            {pool.xRatio.toString()} {pool.xRatio.baseAsset.ticker}/
            {pool.xRatio.quoteAsset.ticker}
          </Typography.Body>
          <Typography.Body strong>
            {pool.yRatio.toString()} {pool.yRatio.baseAsset.ticker}/
            {pool.yRatio.quoteAsset.ticker}
          </Typography.Body>
        </Flex>
      </Flex.Item>
      <Flex.Item display="flex">
        <Flex.Item marginRight={2}>
          <ConnectWalletButton
            trace={{
              element_name: ElementName.connectWalletButton,
              element_location: ElementLocation.poolOverviewList,
            }}
          >
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
