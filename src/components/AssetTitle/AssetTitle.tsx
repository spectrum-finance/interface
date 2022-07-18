import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Truncate } from '../Truncate/Truncate';

export interface TokenTitleProps {
  readonly asset: AssetInfo;
  readonly size?: 'large' | 'small' | 'extraSmall';
  readonly level?: 1 | 2 | 3 | 4 | 5 | 'body' | 'body-secondary' | undefined;
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
    {level === 'body' || level === 'body-secondary' ? (
      <Typography.Body secondary={level === 'body-secondary'}>
        <Truncate>{asset.ticker || asset.name}</Truncate>
      </Typography.Body>
    ) : (
      <Typography.Title level={level}>
        <Truncate>{asset.ticker || asset.name}</Truncate>
      </Typography.Title>
    )}
  </Flex>
);
