import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { Box, Flex, Typography } from '../../../ergodex-cdk';

export interface PoolPriceProps {
  readonly ammPool: AmmPool;
  readonly ratioOf: 'x' | 'y';
}

export const PoolRatio: FC<PoolPriceProps> = ({ ammPool, ratioOf }) => {
  const price = ratioOf === 'x' ? ammPool.xRatio : ammPool.yRatio;
  const description =
    ratioOf === 'x'
      ? t`${ammPool.x.asset.name} per ${ammPool.y.asset.name}`
      : t`${ammPool.y.asset.name} per ${ammPool.x.asset.name}`;

  return (
    <Box padding={3} borderRadius="s" contrast>
      <Flex col justify="center" align="center">
        <Flex.Item>
          <Typography.Title level={5}>{price.toString()}</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {description}
          </Typography.Text>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
