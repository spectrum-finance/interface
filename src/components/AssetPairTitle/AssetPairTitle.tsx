import { Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetIconPair } from '../AssetIconPair/AssetIconPair';
import { Truncate } from '../Truncate/Truncate';

export interface TokenTitleProps {
  readonly assetX: AssetInfo;
  readonly assetY: AssetInfo;
  readonly size?: 'large' | 'small';
  readonly level?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 'body'
    | 'body-secondary'
    | 'body-strong'
    | undefined;
  readonly bodySize?: 'large';
  readonly gap?: number;
  readonly direction?: 'col' | 'row';
  readonly align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
}

export const AssetPairTitle: FC<TokenTitleProps> = ({
  assetX,
  assetY,
  size,
  level = 5,
  gap = 1,
  bodySize,
  direction = 'row',
  align = 'center',
}) => (
  <Flex align={align} direction={direction}>
    <Flex.Item marginRight={gap}>
      <AssetIconPair size={size} assetX={assetX} assetY={assetY} />
    </Flex.Item>
    {level === 'body' ||
    level === 'body-secondary' ||
    level === 'body-strong' ? (
      <Typography.Body
        secondary={level === 'body-secondary'}
        size={bodySize}
        strong={level === 'body-strong'}
      >
        <Truncate>{assetX.ticker || assetX.name}</Truncate> /{' '}
        <Truncate>{assetY.ticker || assetY.name}</Truncate>
      </Typography.Body>
    ) : (
      <Typography.Title level={level}>
        <Truncate>{assetX.ticker || assetX.name}</Truncate> /{' '}
        <Truncate>{assetY.ticker || assetY.name}</Truncate>
      </Typography.Title>
    )}
  </Flex>
);
