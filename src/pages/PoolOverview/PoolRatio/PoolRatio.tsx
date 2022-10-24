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
        <Truncate>{ammPool.x.asset.ticker}</Truncate> {t`per`}{' '}
        <Truncate>{ammPool.y.asset.ticker}</Truncate>
      </>
    ) : (
      <>
        <Truncate>{ammPool.y.asset.ticker}</Truncate> {t`per`}{' '}
        <Truncate>{ammPool.x.asset.ticker}</Truncate>
      </>
    );

  return (
    <Box padding={3} borderRadius="l" secondary>
      <Flex col justify="center" align="center">
        <Flex.Item>
          <Typography.Title level={5}>{price.toString()}</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body secondary size="small">
            {description}
          </Typography.Body>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
