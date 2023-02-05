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
  <Box padding={3} borderRadius="s" secondary glass>
    <Flex col justify="center" align="center">
      <Flex.Item>
        <Typography.Body size="large" strong>
          {ratio ? ratio.toString() : '–'}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <Typography.Body secondary size="small">
          {mainAsset.ticker} per {oppositeAsset.ticker}
        </Typography.Body>
      </Flex.Item>
    </Flex>
  </Box>
);
