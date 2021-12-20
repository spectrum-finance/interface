import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoSVG } from '../../../assets/images/Logo.svg';
import { ReactComponent as NoWordingLogoSVG } from '../../../assets/images/NoWordingLogo.svg';
import { Typography } from '../../../ergodex-cdk';

interface AppLogoProps {
  isNoWording?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  isNoWording,
}): JSX.Element => {
  return (
    <Link to="/" style={{ height: '31px' }}>
      <Typography.Body>
        {isNoWording ? <NoWordingLogoSVG /> : <LogoSVG />}
      </Typography.Body>
    </Link>
  );
};
