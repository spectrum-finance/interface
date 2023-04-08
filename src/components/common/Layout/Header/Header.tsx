import { Flex, useDevice } from '@ergolabs/ui-kit';
import cn from 'classnames';
import React from 'react';
import { isDesktop } from 'react-device-detect';
import styled from 'styled-components';

import { device } from '../../../../common/constants/size';
import { useObservable } from '../../../../common/hooks/useObservable';
import { selectedWalletState$ } from '../../../../gateway/api/wallets';
import { WalletState } from '../../../../network/common/Wallet';
import { IsCardano } from '../../../IsCardano/IsCardano';
import { IsErgo } from '../../../IsErgo/IsErgo';
import { AppLogo } from '../../AppLogo/AppLogo';
import { CardanoMaintenance } from '../CardanoMaintenance/CardanoMaintenance';
import { OperationsHistory } from '../OperationsHistory/OperationsHistory';
import { Analytics } from './Analytics/Analytics';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ClaimSpfButton } from './ClaimSpfButton/ClaimSpfButton';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { GetTestTokensButton } from './GetTestTokensButton/GetTestTokensButton';
import { Navigation } from './Navigation/Navigation';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

export interface HeaderProps {
  className?: string;
  scrolled?: boolean;
  scrolledTop?: boolean;
}

const HeaderWrapper = styled.div`
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
`;

export const _Header: React.FC<HeaderProps> = ({
  className,
  scrolled,
  scrolledTop,
}) => {
  const { s, moreThan } = useDevice();
  const [walletState] = useObservable(selectedWalletState$);

  return (
    <header
      className={cn(
        {
          scrolled,
          scrolledFromTop: moreThan('s') && !scrolledTop,
        },
        className,
      )}
    >
      <CardanoMaintenance />
      <HeaderWrapper>
        <Flex align="center" style={{ gap: '8px' }}>
          <Flex.Item marginRight={2} align="center">
            <AppLogo isNoWording />
          </Flex.Item>
          {moreThan('l') && <Navigation />}
          <Analytics />
        </Flex>
        <Flex align="center" style={{ gap: '8px', marginLeft: 'auto' }}>
          {!s && isDesktop && (
            <IsErgo>
              <ClaimSpfButton />
            </IsErgo>
          )}
          <NetworkDropdown />
          <ConnectWallet />
          {!s && walletState === WalletState.CONNECTED && <OperationsHistory />}
          <BurgerMenu />
        </Flex>
      </HeaderWrapper>
    </header>
  );
};

export const Header = styled(_Header)`
  position: fixed;
  z-index: 3;
  top: 0;
  width: 100%;
  transition: transform 0.3s;

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
`;
