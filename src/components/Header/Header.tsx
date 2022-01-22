import './Header.less';

import React from 'react';

import { networkAssetBalance$ } from '../../api/networkAssetBalance';
import { useObservable } from '../../common/hooks/useObservable';
import { useSettings } from '../../context';
import { WalletState, walletState$ } from '../../services/new/core';
import { AppLogo } from '../common/AppLogo/AppLogo';
import { TxHistory } from '../common/TxHistory/TxHistory';
import { AnalyticsDataTag } from './AnalyticsDataTag/AnalyticsDataTag';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { HeaderTabs } from './HeaderTabs/HeaderTabs';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

const networks = [
  { name: 'ergo', token: 'erg', isDisabled: false },
  { name: 'cardano', token: 'ada', isDisabled: true },
];

export const Header: React.FC = () => {
  const [{ address }] = useSettings();
  // TODO: Update with rx [EDEX-487]
  const [balance] = useObservable(networkAssetBalance$);
  const [walletState] = useObservable(walletState$);

  return (
    <header className="header">
      <div className="header__wrapper">
        <div className="header__left">
          <AppLogo isNoWording />
          <AnalyticsDataTag />
        </div>
        <HeaderTabs />
        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            numberOfPendingTxs={0}
            address={address}
            balance={balance}
          />
          {walletState === WalletState.CONNECTED && <TxHistory />}
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
