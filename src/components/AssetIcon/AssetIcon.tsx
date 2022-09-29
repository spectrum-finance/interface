import React, { useEffect, useState } from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { UnknownTokenIcon } from '../UnknownTokenIcon/UnknownTokenIcon';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  size?: 'large' | 'small' | 'extraSmall';
};

const MAP_SIZE_TO_NUMBER = {
  extraSmall: 16,
  small: 20,
  medium: 24,
  large: 32,
};

enum ErrorState {
  DARK_ICON_NOT_FOUND,
  ICON_NOT_FOUND,
}

const assetErrorCache = new Set<string>();

const AssetIcon: React.FC<TokenIconProps> = ({
  asset,
  size,
  style,
  ...rest
}) => {
  const [errorState, setErrorState] = useState<ErrorState | undefined>(
    asset && assetErrorCache.has(asset.id)
      ? ErrorState.ICON_NOT_FOUND
      : undefined,
  );

  useEffect(() => {
    if (asset) {
      setErrorState(
        assetErrorCache.has(asset.id) ? ErrorState.ICON_NOT_FOUND : undefined,
      );
    }
  }, [asset]);

  const handleError = () => {
    setErrorState(ErrorState.ICON_NOT_FOUND);
    if (asset) {
      assetErrorCache.add(asset.id);
    }
  };

  return (
    <span
      role="img"
      style={{
        ...style,
        display: 'inherit',
        width: MAP_SIZE_TO_NUMBER[size || 'medium'],
        height: MAP_SIZE_TO_NUMBER[size || 'medium'],
        overflow: 'hidden',
        borderRadius: '50%',
        ...style,
      }}
      {...rest}
    >
      {errorState === ErrorState.ICON_NOT_FOUND ? (
        <UnknownTokenIcon
          asset={asset}
          size={MAP_SIZE_TO_NUMBER[size || 'medium']}
        />
      ) : (
        <img
          style={{ verticalAlign: 'initial' }}
          alt="Token Icon"
          src={asset?.icon}
          onError={handleError}
          width={MAP_SIZE_TO_NUMBER[size || 'medium']}
          height={MAP_SIZE_TO_NUMBER[size || 'medium']}
        />
      )}
    </span>
  );
};

export { AssetIcon };
