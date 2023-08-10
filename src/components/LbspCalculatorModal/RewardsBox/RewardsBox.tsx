import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { networkAsset } from '../../../network/cardano/api/networkAsset/networkAsset';
import {
  calculateLbspApr,
  calculateLbspReward,
} from '../../../pages/Liquidity/common/columns/PoolsOrPositionsColumns/columns/AprColumn/CardanoAprColumnContent/calculateLbspApr';
import { AssetIcon } from '../../AssetIcon/AssetIcon';

export interface RewardsBoxProps {
  readonly ammPool: AmmPool;
  readonly x: Currency;
  readonly y: Currency;
  readonly duration: number;
}

export const RewardsBox: FC<RewardsBoxProps> = ({
  ammPool,
  x,
  y,
  duration,
}) => {
  const [lbspApr] = useObservable(calculateLbspApr(ammPool), [ammPool]);
  const reward = calculateLbspReward(
    x.isAssetEquals(networkAsset) ? x : y,
    ammPool,
    duration,
  );

  return (
    <Box bordered borderRadius="l" padding={4}>
      <Flex col>
        <Flex.Item marginBottom={2} display="flex" justify="space-between">
          <Typography.Body size="large">
            <Trans>Estimated rewards:</Trans>
          </Typography.Body>
          <Flex.Item display="flex" align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon size="small" asset={reward.asset} />
            </Flex.Item>
            <Typography.Body strong>
              {reward.toCurrencyString()}
            </Typography.Body>
          </Flex.Item>
        </Flex.Item>
        <Flex.Item display="flex" justify="space-between">
          <Typography.Body size="large">
            <Trans>LBSP APR::</Trans>
          </Typography.Body>
          <Flex.Item display="flex" align="center">
            <Flex.Item marginRight={1}>
              <AssetIcon size="small" asset={reward.asset} />
            </Flex.Item>
            <Typography.Body strong>{lbspApr}%</Typography.Body>
          </Flex.Item>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
