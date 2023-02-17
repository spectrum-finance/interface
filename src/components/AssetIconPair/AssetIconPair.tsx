import { Flex } from '@ergolabs/ui-kit';
import React, { CSSProperties } from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { AssetIcon } from '../AssetIcon/AssetIcon';

export type TokenPair = { tokenA?: string; tokenB?: string };

type TokenIconPairSize = 'large' | 'small' | 'extraLarge';

interface TokenIconPairProps {
  assetX?: AssetInfo;
  assetY?: AssetInfo;
  size?: TokenIconPairSize;
}

const pairLeftMargin: Record<TokenIconPairSize, CSSProperties['marginLeft']> = {
  extraLarge: -16,
  large: -10,
  small: -10,
};

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
        style={{ display: 'flex', marginLeft: pairLeftMargin[size ?? 'small'] }}
        asset={assetY}
      />
    </Flex>
  );
};

export { AssetIconPair };
