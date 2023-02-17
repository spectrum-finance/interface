import React, { useEffect, useState } from 'react';

import { applicationConfig } from '../../applicationConfig';
import { AssetInfo } from '../../common/models/AssetInfo';
import { UnknownTokenIcon } from '../UnknownTokenIcon/UnknownTokenIcon';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  size?: 'medium' | 'large' | 'small' | 'extraSmall' | 'extraLarge';
};

const MAP_SIZE_TO_NUMBER = {
  extraSmall: 16,
  small: 20,
  medium: 24,
  large: 32,
  extraLarge: 48,
};

enum ErrorState {
  DARK_ICON_NOT_FOUND,
  ICON_NOT_FOUND,
}

const AssetIcon: React.FC<TokenIconProps> = ({
  asset,
  size = 'medium',
  style,
  ...rest
}) => {
  const iconName = asset?.id || 'empty';
  const [errorState, setErrorState] = useState<ErrorState | undefined>(
    undefined,
  );

  useEffect(() => {
    if (asset) {
      setErrorState(undefined);
    }
  }, [asset]);

  const handleError = () => {
    setErrorState(ErrorState.ICON_NOT_FOUND);
  };

  return (
    <span
      role="img"
      style={{
        display: 'flex',
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
      ) : (
        <img
          style={{ verticalAlign: 'initial' }}
          alt="Token Icon"
          src={
            asset?.icon ||
            `${applicationConfig.networksSettings.ergo.metadataUrl}/light/${iconName}.svg`
          }
          onError={handleError}
          width={MAP_SIZE_TO_NUMBER[size]}
          height={MAP_SIZE_TO_NUMBER[size]}
        />
      )}
    </span>
  );
};

export { AssetIcon };
