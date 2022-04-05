import React from 'react';
import { from, Observable, throwError } from 'rxjs';

import { ReactComponent as NamiLogo } from '../../../../../assets/icons/nami-logo-icon.svg';
import { CardanoWalletContract } from '../CardanoWalletContract';

export const Gero: CardanoWalletContract = {
  connectWallet(): Observable<boolean | React.ReactNode> {
    if (!cardano?.gerowallet) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return from(cardano.gerowallet.enable().then(() => true)) as any;
  },
  definition: 'default',
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe/overview',
  walletSupportedFeatures: { createPool: true },
  name: 'GeroWallet',
  icon: <NamiLogo width={26} height={26} />,
};
