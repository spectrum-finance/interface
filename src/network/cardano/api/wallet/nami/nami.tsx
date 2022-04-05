import React from 'react';
import { from, Observable, throwError } from 'rxjs';

import { ReactComponent as NamiLogo } from '../../../../../assets/icons/nami-logo-icon.svg';
import { CardanoWalletContract } from '../CardanoWalletContract';

export const Nami: CardanoWalletContract = {
  connectWallet(): Observable<boolean | React.ReactNode> {
    if (!cardano?.nami) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return from(cardano.nami.enable().then(() => true)) as any;
  },
  definition: 'default',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  walletSupportedFeatures: { createPool: true },
  name: 'Nami',
  icon: <NamiLogo width={26} height={26} />,
};
