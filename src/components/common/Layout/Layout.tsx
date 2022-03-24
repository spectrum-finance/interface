import './Layout.less';

import React, { useEffect } from 'react';

import { useAppLoadingState, useSettings } from '../../../context';
import { Modal } from '../../../ergodex-cdk';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';
import { NetworkHeight } from '../../NetworkHeight/NetworkHeight';
import { SocialLinks } from '../../SocialLinks/SocialLinks';
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
      Modal.open(({ close }) => <KyaModal onClose={close} />);
    }
  }, [isKYAAccepted]);

  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <footer>
        <SocialLinks />
        <NetworkHeight />
      </footer>
    </div>
  );
};

export default Layout;
