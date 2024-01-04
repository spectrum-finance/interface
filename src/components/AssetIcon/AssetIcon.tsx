import { useEffect, useState } from 'react';
import * as React from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { UnknownTokenIcon } from '../UnknownTokenIcon/UnknownTokenIcon';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  size?:
    | 'medium'
    | 'large'
    | 'small'
    | 'extraSmall'
    | 'extraLarge'
    | 'tiny'
    | 'selectNetwork';
  inline?: boolean;
};

const MAP_SIZE_TO_NUMBER = {
  tiny: 10,
  extraSmall: 16,
  small: 20,
  medium: 24,
  large: 32,
  extraLarge: 48,
  // TODO: Add custom size possibility
  selectNetwork: 88,
};

enum ErrorState {
  ALT_ICON,
  ICON_NOT_FOUND,
}

const AssetIcon: React.FC<TokenIconProps> = ({
  asset,
  size = 'medium',
  style,
  inline,
  ...rest
}) => {
  const [errorState, setErrorState] = useState<ErrorState | undefined>(
    undefined,
  );
  const [assetLogoUrl, setAssetLogoUrl] = useState(asset?.icon);
  const [assetLogoAltUrl, setAssetLogoAltUrl] = useState(asset?.url);

  useEffect(() => {
    setAssetLogoUrl((prev) => {
      return prev === asset?.icon ? prev : asset?.icon;
    });
    setAssetLogoAltUrl((prev) => {
      return prev === asset?.url ? prev : asset?.url;
    });
    if (asset) {
      setErrorState(undefined);
    }
  }, [asset?.id]);

  const handleError = () => {
    if (errorState === undefined && asset?.url) {
      setErrorState(ErrorState.ALT_ICON);
    } else {
      setErrorState(ErrorState.ICON_NOT_FOUND);
    }
  };

  return (
    <span
      role="img"
      style={{
        display: inline ? 'inline-block' : 'flex',
        width: MAP_SIZE_TO_NUMBER[size],
        height: MAP_SIZE_TO_NUMBER[size],
        overflow: 'hidden',
        borderRadius: '50%',
        ...style,
      }}
      {...rest}
    >
      {errorState === ErrorState.ICON_NOT_FOUND ? (
        <UnknownTokenIcon asset={asset} size={MAP_SIZE_TO_NUMBER[size]} />
      ) : errorState === ErrorState.ALT_ICON ? (
        <img
          style={{ verticalAlign: 'initial' }}
          alt="Token Icon"
          src={assetLogoAltUrl}
          onError={handleError}
          width={MAP_SIZE_TO_NUMBER[size]}
          height={MAP_SIZE_TO_NUMBER[size]}
        />
      ) : (
        <img
          style={{ verticalAlign: 'initial' }}
          alt="Token Icon"
          src={assetLogoUrl}
          onError={handleError}
          width={MAP_SIZE_TO_NUMBER[size]}
          height={MAP_SIZE_TO_NUMBER[size]}
        />
      )}
    </span>
  );
};

export { AssetIcon };
