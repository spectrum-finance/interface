import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

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
