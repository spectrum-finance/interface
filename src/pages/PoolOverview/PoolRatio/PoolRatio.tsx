import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { Truncate } from '../../../components/Truncate/Truncate';

export interface PoolPriceProps {
  readonly ammPool: AmmPool;
  readonly ratioOf: 'x' | 'y';
}

export const PoolRatio: FC<PoolPriceProps> = ({ ammPool, ratioOf }) => {
  const price = ratioOf === 'x' ? ammPool.xRatio : ammPool.yRatio;
  const description =
    ratioOf === 'x' ? (
      <>
        <Truncate>{ammPool.x.asset.name}</Truncate> {t`per`}{' '}
        <Truncate>{ammPool.y.asset.name}</Truncate>
      </>
    ) : (
      <>
        <Truncate>{ammPool.y.asset.name}</Truncate> {t`per`}{' '}
        <Truncate>{ammPool.x.asset.name}</Truncate>
      </>
    );

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
