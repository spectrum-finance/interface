import { Flex } from '@ergolabs/ui-kit';
import React from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetIcon } from '../AssetIcon/AssetIcon';

export type TokenPair = { tokenA?: string; tokenB?: string };

interface TokenIconPairProps {
  assetX?: AssetInfo;
  assetY?: AssetInfo;
  size?: 'large' | 'small';
}

const AssetIconPair: React.FC<TokenIconPairProps> = ({
  assetX,
  assetY,
  size,
}) => {
  return (
    <Flex align="center">
      <AssetIcon size={size} asset={assetX} />
      <AssetIcon
        size={size}
        style={{ display: 'flex', marginLeft: '-10px' }}
        asset={assetY}
      />
    </Flex>
  );
};

export { AssetIconPair };
