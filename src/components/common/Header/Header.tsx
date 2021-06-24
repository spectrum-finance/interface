import { Text, Row } from '@geist-ui/react';
import React from 'react';
import { ConnectWallet } from '../../ConnectWallet/ConnectWallet';
import css from './header.module.scss';

const Header = () => {
  return (
    <header className={css.header}>
      <Text h2>ErgoDex</Text>
      <ConnectWallet />
    </header>
  );
};

export default Header;
