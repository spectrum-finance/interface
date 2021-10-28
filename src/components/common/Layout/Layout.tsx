import './Layout.less';

import React from 'react';

import { Header } from '../../Header/Header';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
