import './Header.less';

import React from 'react';

import { useSettings } from '../../context';
import { Logo } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { cardanoNetwork } from '../../networks/cardano/cardano';
import { ergoNetwork } from '../../networks/ergo/ergo';
import { WalletState } from '../../networks/shared';
import {
  nativeToken$,
  nativeTokenBalance$,
  walletState$,
} from '../../services/new/core';
import { setNetwork } from '../../services/new/network';
import { TxHistory } from '../common/TxHistory/TxHistory';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { HeaderTabs } from './HeaderTabs';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

const networks = [
  { name: 'ergo', token: 'erg', isDisabled: false },
  { name: 'cardano', token: 'ada', isDisabled: false },
];

export const Header: React.FC = () => {
  const [{ address }] = useSettings();
  // TODO: Update with rx [EDEX-487]
  const [balance] = useObservable(nativeTokenBalance$);
  const [nativeToken] = useObservable(nativeToken$);
  const [walletState] = useObservable(walletState$);

  const handleNetworkChange = (n: any) => {
    if (n === 'ergo') {
      setNetwork(ergoNetwork);
    } else {
      setNetwork(cardanoNetwork);
    }
  };

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo label />
        <HeaderTabs />

        <div className="header__options">
          <NetworkDropdown
            networks={networks}
            onSetNetwork={handleNetworkChange}
          />
          <ConnectWallet
            numberOfPendingTxs={0}
            address={address}
            balance={balance}
            currency={nativeToken?.name}
          />
          {walletState === WalletState.CONNECTED && <TxHistory />}
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
