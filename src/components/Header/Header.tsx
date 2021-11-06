import './Header.less';

import React from 'react';

import { ERG_TOKEN_NAME } from '../../constants/erg';
import { Logo } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { ergoBalance$ } from '../../services/new/wallet';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { GlobalSettings } from './GlobalSettings/GlobalSettings';
import { HeaderTabs } from './HeaderTabs';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

const networks = [
  { name: 'ergo', token: 'erg', isDisabled: false },
  { name: 'cardano', token: 'ada', isDisabled: true },
];

export const Header: React.FC = () => {
  const [balance] = useObservable(ergoBalance$);

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo label />
        <HeaderTabs />

        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            numberOfPendingTxs={0}
            balance={balance}
            currency={ERG_TOKEN_NAME}
            address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
          />
          <GlobalSettings />
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
