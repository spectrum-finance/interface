import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React from 'react';

const EMPTY_TOKEN = `https://raw.githubusercontent.com/ergolabs/ergo-dex-asset-icons/master/empty.svg`;

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  size?: 'large' | 'small';
};

const MAP_SIZE_TO_NUMBER = {
  small: 20,
  medium: 24,
  large: 32,
};

const TokenIcon: React.FC<TokenIconProps> = ({ asset, size, ...rest }) => {
  const iconName = asset?.id || 'empty';

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
        src={`https://raw.githubusercontent.com/ergolabs/ergo-dex-asset-icons/master/${iconName}.svg`}
        //@ts-ignore
        onError={(e) => (e.target.src = EMPTY_TOKEN)}
        width={MAP_SIZE_TO_NUMBER[size || 'medium']}
        height={MAP_SIZE_TO_NUMBER[size || 'medium']}
      />
    </span>
  );
};

export { TokenIcon };
