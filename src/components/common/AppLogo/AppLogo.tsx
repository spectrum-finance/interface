import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoSVG } from '../../../assets/images/Logo.svg';
import { Typography } from '../../../ergodex-cdk';

export const AppLogo: React.FC = (): JSX.Element => {
  return (
    <Link to="/">
      <Typography.Body>
        <LogoSVG />
      </Typography.Body>
    </Link>
  );
};
