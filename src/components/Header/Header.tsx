import './Header.less';

import cn from 'classnames';
import React, { MutableRefObject, RefObject, useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

import { useObservable } from '../../common/hooks/useObservable';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { selectedWalletState$ } from '../../gateway/api/wallets';
import { settings$ } from '../../gateway/settings/settings';
import { WalletState } from '../../network/common/Wallet';
import { AppLogo } from '../common/AppLogo/AppLogo';
import { CardanoMaintenance } from '../common/Layout/CardanoMaintenance/CardanoMaintenance';
import { TxHistory } from '../common/TxHistory/TxHistory';
import { IsCardano } from '../IsCardano/IsCardano';
import { IsErgo } from '../IsErgo/IsErgo';
import { Analytics } from './Analytics/Analytics';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { GetTestTokensButton } from './GetTestTokensButton/GetTestTokensButton';
import { Navigation } from './Navigation/Navigation';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

export interface HeaderProps {
  layoutRef: RefObject<HTMLDivElement>;
}

export const Header: React.FC<HeaderProps> = ({ layoutRef }) => {
  const [settings] = useObservable(settings$);
  const [balance, isBalanceLoading] = useAssetsBalance();
  const [networkAsset] = useNetworkAsset();
  const [walletState] = useObservable(selectedWalletState$);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let currentScrollY = layoutRef.current?.scrollTop || 0;

    const handleScroll = () => {
      if (currentScrollY > (layoutRef.current?.scrollTop || 0)) {
        setHidden(false);
      }
      if (currentScrollY < (layoutRef.current?.scrollTop || 0)) {
        setHidden(true);
      }
      currentScrollY = layoutRef.current?.scrollTop || 0;
    };

    layoutRef.current?.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, [layoutRef]);

  return (
    <header
      className={cn('header', {
        header_hidden: hidden,
      })}
    >
      <CardanoMaintenance />
      <div className="header__wrapper">
        <div className="header__left">
          <AppLogo isNoWording />
          {isBrowser && (
            <>
              <Navigation />
              <IsErgo>
                <Analytics />
              </IsErgo>
              <IsCardano>
                <GetTestTokensButton />
              </IsCardano>
            </>
          )}
        </div>
        <div className="header__options">
          {isBrowser && (
            <>
              <NetworkDropdown />
              <ConnectWallet
                numberOfPendingTxs={0}
                address={settings?.address}
                balance={
                  isBalanceLoading ? undefined : balance.get(networkAsset)
                }
              />
              <IsErgo>
                {walletState === WalletState.CONNECTED && <TxHistory />}
              </IsErgo>
            </>
          )}
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
