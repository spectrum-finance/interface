import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

import { Flex } from '../../ergodex-cdk';
import { TokenIcon } from '../TokenIcon/TokenIcon';

export type TokenPair = { tokenA?: string; tokenB?: string };

interface TokenIconPairProps {
  assetX?: AssetInfo;
  assetY?: AssetInfo;
  size?: 'large' | 'small';
}

const TokenIconPair: React.FC<TokenIconPairProps> = ({
  assetX,
  assetY,
  size,
}) => {
  return (
    <Flex align="center">
      <TokenIcon size={size} asset={assetX} />
      <TokenIcon
        size={size}
        style={{ display: 'flex', marginLeft: '-10px' }}
        asset={assetY}
      />
    </Flex>
  );
};

export { TokenIconPair };
