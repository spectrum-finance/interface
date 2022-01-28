import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

import { isVerifiedToken } from '../../utils/verification';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  name?: string;
  size?: 'large';
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
];

const TokenIcon: React.FC<TokenIconProps> = ({
  asset,
  name,
  size,
  ...rest
}) => {
  let isAccessibleToken = false;

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
        width: size === 'large' ? 32 : 24,
        height: size === 'large' ? 32 : 24,
      }}
      {...rest}
    >
      <img
        src={`/assets/tokens/token-${
          iconName && isAccessibleToken ? iconName.toLowerCase() : 'empty'
        }.svg`}
        width={size === 'large' ? 32 : 24}
        height={size === 'large' ? 32 : 24}
      />
    </span>
  );
};

export { TokenIcon };
