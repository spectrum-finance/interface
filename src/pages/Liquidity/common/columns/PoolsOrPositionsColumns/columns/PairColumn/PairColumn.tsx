import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Ratio } from '../../../../../../../common/models/Ratio';
import { AssetPairTitle } from '../../../../../../../components/AssetPairTitle/AssetPairTitle';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { Truncate } from '../../../../../../../components/Truncate/Truncate';

const _RatioBox: FC<{ ratio: Ratio; className?: string }> = ({
  ratio,
  className,
}) => (
  <Box padding={[0, 1]}>
    <Typography.Body className={className} strong>
      <Truncate limit={5}>{ratio.baseAsset.ticker}</Truncate> {ratio.toString()}{' '}
      <Truncate limit={5}>{ratio.quoteAsset.ticker}</Truncate>
    </Typography.Body>
  </Box>
);

const RatioBox = styled(_RatioBox)`
  font-size: 10px !important;
  line-height: 15px !important;
`;

export interface PairColumnProps {
  readonly ammPool: AmmPool;
}

export const PairColumn: FC<PairColumnProps> = ({ ammPool }) => (
  <Flex col>
    <Flex.Item display="flex" align="center" marginBottom={2}>
      <Flex.Item>
        <AssetPairTitle assetX={ammPool.x.asset} assetY={ammPool.y.asset} />
      </Flex.Item>
      <Flex.Item marginLeft={2}>
        <DataTag content={`${ammPool.poolFee}%`} />
      </Flex.Item>
    </Flex.Item>
    <Flex.Item display="flex" inline align="center">
      <Flex.Item marginRight={2}>
        <RatioBox ratio={ammPool.xRatio} />
      </Flex.Item>
      <RatioBox ratio={ammPool.yRatio} />
    </Flex.Item>
  </Flex>
);
