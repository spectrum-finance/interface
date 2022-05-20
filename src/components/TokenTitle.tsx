import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC } from 'react';

import { Flex, Typography } from '../ergodex-cdk';
import { AssetIcon } from './AssetIcon/AssetIcon';

export interface TokenTitleProps {
  readonly asset: AssetInfo;
  readonly size?: 'large' | 'small';
}

export const TokenTitle: FC<TokenTitleProps> = ({ asset, size }) => (
  <Flex align="center">
    <Flex.Item marginRight={1}>
      <AssetIcon size={size} asset={asset} />
    </Flex.Item>
    <Typography.Title level={5}>{asset.name}</Typography.Title>
  </Flex>
);
