import { useEffect, useState } from 'react';
import * as React from 'react';

import { AssetInfo } from '../../common/models/AssetInfo';
import { UnknownTokenIcon } from '../UnknownTokenIcon/UnknownTokenIcon';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  asset?: AssetInfo;
  size?: 'medium' | 'large' | 'small' | 'extraSmall' | 'extraLarge' | 'tiny';
  inline?: boolean;
};

const MAP_SIZE_TO_NUMBER = {
  tiny: 10,
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
  inline,
  ...rest
}) => {
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
      ) : (
        <img
          style={{ verticalAlign: 'initial' }}
          alt="Token Icon"
          src={asset?.icon}
          onError={handleError}
          width={MAP_SIZE_TO_NUMBER[size]}
          height={MAP_SIZE_TO_NUMBER[size]}
        />
      )}
    </span>
  );
};

export { AssetIcon };
