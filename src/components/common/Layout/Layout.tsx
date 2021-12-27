import './Layout.less';

import React, { useEffect } from 'react';
import Snowfall from 'react-snowfall';

import { useAppLoadingState, useSettings } from '../../../context';
import { Modal } from '../../../ergodex-cdk';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';
import { SocialLinks } from '../../SocialLinks/SocialLinks';
import { KyaModal } from '../KyaModal/KyaModal';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children }: Props): JSX.Element => {
  const [{ theme }] = useSettings();
  const [settings] = useSettings();

  useBodyClass(theme);

  const [{ isKYAAccepted }] = useAppLoadingState();

  useEffect(() => {
    if (!isKYAAccepted) {
      Modal.open(({ close }) => <KyaModal onClose={close} />);
    }
  }, [isKYAAccepted]);

  return (
    <div className="layout">
      {settings.isSnowFallActive && <Snowfall color="rgba(255, 81, 53, 0.5)" />}
      <Header />
      <main>{children}</main>
      <SocialLinks />
    </div>
  );
};

export default Layout;
