import './Layout.less';

import React from 'react';

import { Header } from '../../../ergodex-cdk/components/Header/Header';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
