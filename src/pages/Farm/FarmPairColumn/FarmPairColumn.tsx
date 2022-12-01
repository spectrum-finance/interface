import { Flex, Tag } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { LmPool } from '../../../common/models/LmPool';
import { AssetPairTitle } from '../../../components/AssetPairTitle/AssetPairTitle';

export interface PairColumnProps {
  readonly lmPool: LmPool;
  readonly status: string;
  readonly direction?: 'col' | 'row';
  readonly align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
}

export const FarmPairColumn: FC<PairColumnProps> = ({
  lmPool,
  status,
  direction = 'row',
  align = 'center',
}) => (
  <Flex align="center">
    <Flex.Item>
      <AssetPairTitle
        assetX={lmPool.assetX}
        assetY={lmPool.assetY}
        direction={direction}
        align={align}
      />
    </Flex.Item>
    <Flex.Item marginLeft={2}>
      <Tag color="orange">{status}</Tag>
    </Flex.Item>
  </Flex>
);
