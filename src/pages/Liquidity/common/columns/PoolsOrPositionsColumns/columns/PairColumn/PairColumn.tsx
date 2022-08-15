import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { AssetPairTitle } from '../../../../../../components/AssetPairTitle/AssetPairTitle';
import { DataTag } from '../../../../../../components/common/DataTag/DataTag';

export interface PairColumnProps {
  readonly ammPool: AmmPool;
}

export const PairColumn: FC<PairColumnProps> = ({ ammPool }) => (
  <Flex align="center">
    <Flex.Item>
      <AssetPairTitle assetX={ammPool.x.asset} assetY={ammPool.y.asset} />
    </Flex.Item>
    <Flex.Item marginLeft={2}>
      <DataTag content={`${ammPool.poolFee}%`} />
    </Flex.Item>
  </Flex>
);
