import { Flex, Tag } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { AssetPairTitle } from '../../../components/AssetPairTitle/AssetPairTitle';

export interface PairColumnProps {
  readonly ammPool: AmmPool;
  readonly status: string;
}

export const FarmPairColumn: FC<PairColumnProps> = ({ ammPool, status }) => (
  <Flex align="center">
    <Flex.Item>
      <AssetPairTitle assetX={ammPool.x.asset} assetY={ammPool.y.asset} />
    </Flex.Item>
    <Flex.Item marginLeft={2}>
      <Tag color="orange">{status}</Tag>
    </Flex.Item>
  </Flex>
);
