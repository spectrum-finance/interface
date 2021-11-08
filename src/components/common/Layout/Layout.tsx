import './Layout.less';

import React, { useEffect } from 'react';

import { useAppLoadingState, useSettings } from '../../../context';
import { Modal } from '../../../ergodex-cdk';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';
import { KyaModal } from '../KyaModal/KyaModal';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  const [{ theme }] = useSettings();
  useBodyClass(theme);

  const [{ isKYAAccepted }] = useAppLoadingState();
  useEffect(() => {
    if (!isKYAAccepted) {
      Modal.open(({ close }) => <KyaModal onClose={close} />, {
        title: 'Know Your Assumptions',
        width: 680,
      });
    }
  }, [isKYAAccepted]);

  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
