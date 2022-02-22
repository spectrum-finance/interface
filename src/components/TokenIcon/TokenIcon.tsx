import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

import { isVerifiedToken } from '../../utils/verification';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  name?: string;
  size?: 'large' | 'small';
};

const accessibleTokens = [
  'ERG',
  'ERGX',
  'ADA',
  'SigUSD',
  'SigRSV',
  'Kushti',
  'Erdoge',
  'ADA-disabled',
  'LunaDog',
  'NETA',
  'ergopad',
];

const MAP_SIZE_TO_NUMBER = {
  small: 20,
  medium: 24,
  large: 32,
};

const TokenIcon: React.FC<TokenIconProps> = ({
  asset,
  name,
  size,
  ...rest
}) => {
  let isAccessibleToken;

  // TODO: REPLACE ALL STRINGS TO ASSET_INFO
  if (asset) {
    isAccessibleToken = isVerifiedToken(asset);
  } else {
    isAccessibleToken = accessibleTokens.some(
      (tokenName) => tokenName.toLowerCase() === name?.toLocaleLowerCase(),
    );
  }

  const iconName = asset?.name || name;

  return (
    <span
      role="img"
      className={`token-icon token-icon-${iconName?.toLowerCase()}`}
      style={{
        display: 'inherit',
        width: MAP_SIZE_TO_NUMBER[size || 'medium'],
        height: MAP_SIZE_TO_NUMBER[size || 'medium'],
      }}
      {...rest}
    >
      <img
        alt="Token Icon"
        src={`/assets/tokens/token-${
          iconName && isAccessibleToken ? iconName.toLowerCase() : 'empty'
        }.svg`}
        width={MAP_SIZE_TO_NUMBER[size || 'medium']}
        height={MAP_SIZE_TO_NUMBER[size || 'medium']}
      />
    </span>
  );
};

export { TokenIcon };
