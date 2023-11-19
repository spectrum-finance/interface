import { /* Flex, */ useDevice } from '@ergolabs/ui-kit';

//import cn from 'classnames';
//import * as React from 'react';
//import { Link } from 'react-router-dom';
//import styled from 'styled-components';
//import { device } from '../../../../common/constants/size';
//import { isPreLbspTimeGap } from '../../../../utils/lbsp';
//import { IsCardano } from '../../../IsCardano/IsCardano';
//import { DeprecatedPosition } from '../DeprecatedPositions/DeprecatedPosition';
import { OperationsHistory } from '../OperationsHistory/OperationsHistory';
import ConnectWallet from './ConnectWallet/ConnectWallet';
//import { Analytics } from './Analytics/Analytics';
import styles from './Header.module.less';
import Navigation from './Navigation/Navigation';
//import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

export interface HeaderProps {
  className?: string;
  scrolled?: boolean;
  scrolledTop?: boolean;
}

/* const HeaderWrapper = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  padding: 4px;
  grid-template-columns: 1fr 1fr;

  ${device.m} {
    padding: 1rem;
  }

  @media (max-width: 720px) {
    grid-template-columns: 36px 1fr;
    padding: 1.25rem 1rem 0.25rem;
  }
`; */

export default function Header(props: HeaderProps) {
  const { scrolledTop } = props;

  const { s, moreThan } = useDevice();
  console.log(scrolledTop);

  return (
    <header className={styles.header}>
      <section className={styles.navigationSection}>
        {moreThan('m') ? (
          <img src="/img/logo/teddy-logo.png" height={26} />
        ) : (
          <img src="/img/logo/teddy-logo-mob.png" height={26} />
        )}
        <Navigation />
      </section>
      <section className={styles.walletSection}>
        <ConnectWallet />
        {!s && <OperationsHistory />}
      </section>
    </header>
  );
}

/* export const _Header: React.FC<HeaderProps> = ({ className, scrolledTop }) => {
  const { s, moreThan } = useDevice();

  return (
    <header
      className={cn(
        {
          scrolledFromTop: moreThan('s') && !scrolledTop,
        },
        className,
      )}
    >
      <IsCardano>
        <DeprecatedPosition />
      </IsCardano>
      <HeaderWrapper>
        <Flex align="center" style={{ gap: '8px' }}>
          <Link to="/">
            <Flex.Item align="center">
              {moreThan('m') ? (
                <img src="/img/logo/teddy-logo.png" height={26} />
              ) : (
                <img src="/img/logo/teddy-logo-mob.png" height={26} />
              )}
            </Flex.Item>
          </Link>

          <IsErgo>
            {moreThan('l') && <Navigation />}
            <Analytics />
          </IsErgo>
          {!isPreLbspTimeGap() && (
            <IsCardano>
              {moreThan('l') && <Navigation />}
              <Analytics />
            </IsCardano>
          )}
        </Flex>
        <Flex align="center" style={{ gap: '8px', marginLeft: 'auto' }}>
          {!s && isDesktop && (
            <IsErgo>
              <ClaimSpfButton />
            </IsErgo>
          )}
          <NetworkDropdown />
          <ConnectWallet />
          {!s && <OperationsHistory />}
        </Flex>
      </HeaderWrapper>
    </header>
  );
}; */

/* export const Header = styled(_Header)`
  position: fixed;
  z-index: 3;
  top: 0;
  width: 100%;
  transition: transform 0.3s;
  background: var(--teddy-dark-color-container);

  &.scrolledFromTop {
    border-bottom: 1px solid var(--spectrum-box-border-color);
    background: var(--spectrum-box-bg-secondary-glass);
    backdrop-filter: var(--spectrum-box-bg-filter);
  }

  ${device.m} {
    background: none !important;
    border-bottom: 0 !important;

    &.scrolled {
      transform: translateY(-100%);
    }
  }
`; */
