import './Logo.scss';

import React from 'react';

import { ReactComponent as LogoIcon } from '../../assets/images/logoicon.svg';

export interface Props {
  label?: boolean;
}

export const Logo: React.FC<Props> = ({ label }) => {
  return (
    <div className="logo-wrapper">
      <LogoIcon></LogoIcon>
      {label && <span className="logo-label">ERGODEX</span>}
    </div>
  );
};
