import React, { useEffect, useState } from 'react';

import { applicationConfig } from '../../applicationConfig';
import { AssetInfo } from '../../common/models/AssetInfo';
import { UnknownTokenIcon } from '../UnknownTokenIcon/UnknownTokenIcon';

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

enum ErrorState {
  DARK_ICON_NOT_FOUND,
  ICON_NOT_FOUND,
}

const TokenIcon: React.FC<TokenIconProps> = ({ asset, size, ...rest }) => {
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
      className={`token-icon token-icon-${iconName?.toLowerCase()}`}
      style={{
        display: 'inherit',
        width: MAP_SIZE_TO_NUMBER[size || 'medium'],
        height: MAP_SIZE_TO_NUMBER[size || 'medium'],
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
          alt="Token Icon"
          src={
            asset?.icon ||
            `${applicationConfig.networksSettings.ergo.metadataUrl}/light/${iconName}.svg`
          }
          onError={handleError}
          width={MAP_SIZE_TO_NUMBER[size || 'medium']}
          height={MAP_SIZE_TO_NUMBER[size || 'medium']}
        />
      )}
    </span>
  );
};

export { TokenIcon };
