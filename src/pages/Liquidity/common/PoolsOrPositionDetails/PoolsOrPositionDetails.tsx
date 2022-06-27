import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, PropsWithChildren } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Position } from '../../../../common/models/Position';
import { ConnectWalletButton } from '../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';

export interface PoolsOrPositionDetailsProps<T extends AmmPool | Position>
  extends ExpandComponentProps<T> {
  poolMapper: (item: T) => AmmPool;
}

export const PoolsOrPositionDetails: FC<
  PropsWithChildren<PoolsOrPositionDetailsProps<any>>
> = ({ poolMapper, item }) => (
  <Flex stretch align="center">
    <Flex.Item flex={1}>
      <Flex col>
        <Typography.Footnote>
          <Trans>Total liquidity</Trans>
        </Typography.Footnote>
        <Typography.Body strong>
          {poolMapper(item).x.asset.name}: {poolMapper(item).x.toString()}
        </Typography.Body>
        <Typography.Body strong>
          {poolMapper(item).y.asset.name}: {poolMapper(item).y.toString()}
        </Typography.Body>
      </Flex>
    </Flex.Item>
    <Flex.Item display="flex">
      <Flex.Item marginRight={2}>
        <ConnectWalletButton>
          <Button>
            <Trans>Swap</Trans>
          </Button>
        </ConnectWalletButton>
      </Flex.Item>
      <Button type="primary">
        <Trans>Pool Overview</Trans>
      </Button>
    </Flex.Item>
  </Flex>
);
