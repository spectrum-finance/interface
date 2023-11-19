import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { applicationConfig } from '../../../applicationConfig';
import { device } from '../../../common/constants/size';
import { useSelectedNetwork } from '../../../gateway/common/network';
import { IsCardano } from '../../IsCardano/IsCardano';
import { LbspBanner } from '../../LbspBanner/LbspBanner';
import { NetworkHeight } from '../../NetworkHeight/NetworkHeight';
import { CardanoUpdate } from './CardanoUpdate/CardanoUpdate';
import { FooterNavigation } from './FooterNavigation/FooterNavigation';
import Header from './Header/Header';

const MainContainer = styled.main`
  padding: 80px 4px 148px 8px !important;

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
  const ref = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrolledTop, setScrolledTop] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolledTop((ref.current?.scrollTop || 0) < 5);
    };

    ref.current?.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, [ref]);

  const footerHeight = footerRef?.current?.clientHeight || 0;

  return (
    <div ref={ref} className={className}>
      {applicationConfig.cardanoUpdate && network.name !== 'ergo' ? (
        <CardanoUpdate />
      ) : (
        <>
          <Header scrolledTop={scrolledTop} />

          <IsCardano>
            {location.pathname === '/cardano/liquidity' && <LbspBanner />}
          </IsCardano>

          <MainContainer
            style={{ paddingBottom: footerHeight ? footerHeight + 8 : 80 }}
          >
            {children}
          </MainContainer>
          <footer>
            <NetworkHeight />
          </footer>
          <FooterNavigation ref={footerRef} />
        </>
      )}
    </div>
  );
};

export const Layout = styled(_Layout)`
  position: relative;
  height: 100%;
  overflow-y: scroll;
`;
