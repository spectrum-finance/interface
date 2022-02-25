import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC } from 'react';

import { Flex, Typography } from '../ergodex-cdk';
import { TokenIcon } from './TokenIcon/TokenIcon';

export interface TokenTitleProps {
  readonly value: AssetInfo;
}

export const TokenTitle: FC<TokenTitleProps> = ({ value }) => (
  <Flex align="center">
    <Flex.Item marginRight={1}>
      <TokenIcon asset={value} />
    </Flex.Item>
    <Typography.Title level={5}>{value.name}</Typography.Title>
  </Flex>
);
