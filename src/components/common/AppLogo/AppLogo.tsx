import { CSSProperties } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as SplashLogo } from './ergodex_logo.svg';

interface AppLogoProps {
  isNoWording?: boolean;
  style?: CSSProperties;
}

export const AppLogo: React.FC<AppLogoProps> = ({ style }): JSX.Element => {
  return (
    <Link to="/" style={{ height: '40px', ...style }}>
      <SplashLogo fontSize={40} />
    </Link>
  );
};
