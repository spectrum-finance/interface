import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { applicationConfig } from '../../../applicationConfig';
import { device } from '../../../common/constants/size';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { NetworkHeight } from '../../NetworkHeight/NetworkHeight';
import { CardanoUpdate } from './CardanoUpdate/CardanoUpdate';
import FooterNavigation from './FooterNavigation/FooterNavigation';
import Analytics from './Header/Analytics/Analytics';
import Header from './Header/Header';

const MainContainer = styled.main`
  padding: 80px 4px 148px 8px !important;
  min-height: calc(100vh - 70px);

  ${device.m} {
    padding: 80px 18px 80px 24px !important;
  }

  ${device.l} {
    padding-top: 100px !important;
  }

  ${device.l} {
    padding-top: 120px !important;
  }
`;

const _Layout: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  const [network] = useSelectedNetwork();

  return (
    <div className={className}>
      {applicationConfig.cardanoUpdate && network.name !== 'ergo' ? (
        <CardanoUpdate />
      ) : (
        <>
          <Header />

          <MainContainer>{children}</MainContainer>
          <footer>
            <Analytics />
            <NetworkHeight />
          </footer>
          <FooterNavigation />
        </>
      )}
    </div>
  );
};

export const Layout = styled(_Layout)`
  position: relative;
  height: 100%;
  overflow-y: scroll;
  min-height: 100vh;
`;
