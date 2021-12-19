import './Header.less';

import React from 'react';

import { ERG_TOKEN_NAME } from '../../constants/erg';
import { useSettings } from '../../context';
import { useObservable } from '../../hooks/useObservable';
import {
  nativeTokenBalance$,
  WalletState,
  walletState$,
} from '../../services/new/core';
import { AppLogo } from '../common/AppLogo/AppLogo';
import { TxHistory } from '../common/TxHistory/TxHistory';
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
  const [balance] = useObservable(nativeTokenBalance$);
  const [walletState] = useObservable(walletState$);

  return (
    <header className="header">
      <div className="header__wrapper">
        <AppLogo />
        <HeaderTabs />
        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            numberOfPendingTxs={0}
            address={address}
            balance={balance}
            currency={ERG_TOKEN_NAME}
          />
          {walletState === WalletState.CONNECTED && <TxHistory />}
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
