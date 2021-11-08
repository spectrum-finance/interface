import './Layout.less';

import React from 'react';

import { useSettings } from '../../../context';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  const [{ theme }] = useSettings();
  useBodyClass(theme);

  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
