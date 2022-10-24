import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { Ratio } from '../../common/models/Ratio';

export interface RatioBoxProps {
  readonly ratio?: Ratio;
  readonly mainAsset: AssetInfo;
  readonly oppositeAsset: AssetInfo;
}

export const RatioBox: FC<RatioBoxProps> = ({
  ratio,
  mainAsset,
  oppositeAsset,
}) => (
  <Box padding={3} borderRadius="s" secondary>
    <Flex col justify="center" align="center">
      <Flex.Item>
        <Typography.Title level={5}>
          {ratio ? ratio.toString() : '–'}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {mainAsset.ticker} per {oppositeAsset.ticker}
        </Typography.Text>
      </Flex.Item>
    </Flex>
  </Box>
);
