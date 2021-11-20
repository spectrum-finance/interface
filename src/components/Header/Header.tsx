import './Header.less';

import React from 'react';

import { ERG_TOKEN_NAME } from '../../constants/erg';
import { useSettings, useWallet } from '../../context';
import { Logo } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { nativeTokenBalance$ } from '../../services/new/core';
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
  const [{ address }] = useSettings();
  // TODO: Update with rx [EDEX-487]
  // const [balance] = useObservable(nativeTokenBalance$);
  const { ergBalance } = useWallet();

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo label />
        <HeaderTabs />

        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            numberOfPendingTxs={0}
            address={address}
            balance={ergBalance}
            currency={ERG_TOKEN_NAME}
          />
          <GlobalSettings />
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
