import { Logo } from '@ergolabs/ui-kit';
import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface AppLogoProps {
  isNoWording?: boolean;
  style?: CSSProperties;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  isNoWording,
  style,
}): JSX.Element => {
  return (
    <Link to="/" style={{ height: '40px', ...style }}>
      <Logo isNoWording={isNoWording} />
    </Link>
  );
};
