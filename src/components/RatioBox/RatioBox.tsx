import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC } from 'react';

import { Ratio } from '../../common/models/Ratio';
import { Box, Flex, Typography } from '../../ergodex-cdk';

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
  <Box padding={3} borderRadius="s" contrast>
    <Flex col justify="center" align="center">
      <Flex.Item>
        <Typography.Title level={5}>
          {ratio ? ratio.toString() : '–'}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {mainAsset.name} per {oppositeAsset.name}
        </Typography.Text>
      </Flex.Item>
    </Flex>
  </Box>
);
