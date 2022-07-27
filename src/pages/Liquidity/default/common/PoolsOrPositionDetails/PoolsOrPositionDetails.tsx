import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { Position } from '../../../../../common/models/Position';
import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { ExpandComponentProps } from '../../../../../components/TableView/common/Expand';

export interface PoolsOrPositionDetailsProps<T extends AmmPool | Position>
  extends ExpandComponentProps<T> {
  poolMapper: (item: T) => AmmPool;
}

export const PoolsOrPositionDetails: FC<
  PropsWithChildren<PoolsOrPositionDetailsProps<any>>
> = ({ poolMapper, item, children }) => {
  const navigate = useNavigate();

  const overviewPool = () => navigate(poolMapper(item).id);

  const navigateToSwap = () => navigate('../../swap');

  return (
    <Flex stretch align="center">
      <Flex.Item width={311}>
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
      <Flex.Item flex={1}>{children}</Flex.Item>
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
