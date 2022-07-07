import './Layout.less';

import { Modal } from '@ergolabs/ui-kit';
import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { isBrowser } from 'react-device-detect';

import { panalytics } from '../../../common/analytics';
import { useAppLoadingState, useSettings } from '../../../context';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { useBodyClass } from '../../../hooks/useBodyClass';
import { Header } from '../../Header/Header';
import { NetworkHeight } from '../../NetworkHeight/NetworkHeight';
import { SocialLinks } from '../../SocialLinks/SocialLinks';
import { KyaModal } from '../KyaModal/KyaModal';

const Layout: FC<PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => {
  const [{ theme }] = useSettings();
  const [network] = useSelectedNetwork();
  const ref = useRef<HTMLDivElement>(null);

  useBodyClass([theme, network.name.toLowerCase()]);

  const [{ isKYAAccepted }] = useAppLoadingState();

  useEffect(() => {
    if (!isKYAAccepted && isBrowser) {
      Modal.open(({ close }) => <KyaModal onClose={close} />, {
        afterClose: () => panalytics.closeKya(),
      });
    }
  }, [isKYAAccepted]);

  return (
    <div className="layout" ref={ref}>
      <div className="glow" />
      <Header layoutRef={ref} />
      <main>{children}</main>
      <footer>
        <SocialLinks />
        <NetworkHeight />
      </footer>
    </div>
  );
};

export default Layout;
