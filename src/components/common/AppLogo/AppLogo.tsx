import { Typography } from '@ergolabs/ui-kit';
import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoSVG } from '../../../assets/images/Logo.svg';
import { ReactComponent as NoWordingLogoSVG } from '../../../assets/images/NoWordingLogo.svg';

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
      <Typography.Body>
        {isNoWording ? <NoWordingLogoSVG /> : <LogoSVG />}
      </Typography.Body>
    </Link>
  );
};
