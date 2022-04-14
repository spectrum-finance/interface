import './Header.less';

import cn from 'classnames';
import React, { useEffect, useState } from 'react';

import { useAssetsBalance } from '../../api/assetBalance';
import { selectedWalletState$ } from '../../api/wallets';
import { useObservable } from '../../common/hooks/useObservable';
import { useSettings } from '../../context';
import { WalletState } from '../../network/common';
import { useNetworkAsset } from '../../network/ergo/networkAsset/networkAsset';
import { AppLogo } from '../common/AppLogo/AppLogo';
import { GlobalSettingsButton } from '../common/GlobalSettingsButton/GlobalSettingsButton';
import { TxHistory } from '../common/TxHistory/TxHistory';
import { Analytics } from './Analytics/Analytics';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { Navigation } from './Navigation/Navigation';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

const networks = [
  {
    name: 'ergo',
    token: {
      id: '0000000000000000000000000000000000000000000000000000000000000000',
    },
    isDisabled: false,
  },
  { name: 'cardano', token: { id: 'token-ada-disabled' }, isDisabled: true },
];

export const Header: React.FC = () => {
  const [{ address }] = useSettings();
  const [balance, isBalanceLoading] = useAssetsBalance();
  const [networkAsset] = useNetworkAsset();
  const [walletState] = useObservable(selectedWalletState$);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let currentScrollY = window.scrollY;
    const handleScroll = () => {
      if (currentScrollY > window.scrollY) {
        setHidden(false);
      }
      if (currentScrollY < window.scrollY) {
        setHidden(true);
      }
      currentScrollY = window.scrollY;
    };

    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn('header', { header_hidden: hidden })}>
      <div className="header__wrapper">
        <div className="header__left">
          <AppLogo isNoWording />
          <Navigation />
          <Analytics />
        </div>
        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            numberOfPendingTxs={0}
            address={address}
            balance={isBalanceLoading ? undefined : balance.get(networkAsset)}
          />
          {walletState === WalletState.CONNECTED && <TxHistory />}
          <GlobalSettingsButton />
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
