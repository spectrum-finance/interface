import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { SyntheticEvent, useState } from 'react';

import { applicationConfig } from '../../applicationConfig';
import { useSettings } from '../../context';

const EMPTY_TOKEN_ID = `empty`;

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
  const [{ theme }] = useSettings();
  const [errorState, setErrorState] = useState<ErrorState | undefined>(
    undefined,
  );

  const handleLoad = () => setErrorState(0);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (theme === 'dark' && !errorState) {
      //@ts-ignore
      e.target.src = `${applicationConfig.iconsRepository}/light/${iconName}.svg`;
      setErrorState(ErrorState.DARK_ICON_NOT_FOUND);
    } else {
      //@ts-ignore
      e.target.src = `${applicationConfig.iconsRepository}/${EMPTY_TOKEN_ID}.svg`;
      setErrorState(ErrorState.ICON_NOT_FOUND);
    }
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
      <img
        alt="Token Icon"
        src={`${applicationConfig.iconsRepository}/light/${iconName}.svg`}
        onLoad={handleLoad}
        onError={handleError}
        width={MAP_SIZE_TO_NUMBER[size || 'medium']}
        height={MAP_SIZE_TO_NUMBER[size || 'medium']}
      />
    </span>
  );
};

export { TokenIcon };
