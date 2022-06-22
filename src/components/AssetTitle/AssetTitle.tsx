import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Truncate } from '../Truncate/Truncate';

export interface TokenTitleProps {
  readonly asset: AssetInfo;
  readonly size?: 'large' | 'small';
  readonly level?: 1 | 2 | 3 | 4 | 5 | undefined;
  readonly gap?: number;
}

export const AssetTitle: FC<TokenTitleProps> = ({
  asset,
  size,
  level = 5,
  gap = 1,
}) => (
  <Flex align="center">
    <Flex.Item marginRight={gap}>
      <AssetIcon size={size} asset={asset} />
    </Flex.Item>
    <Typography.Title level={level}>
      <Truncate>{asset.name}</Truncate>
    </Typography.Title>
  </Flex>
);
