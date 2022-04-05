import React from 'react';
import { from, Observable, throwError } from 'rxjs';

import { ReactComponent as YoroiLogo } from '../../../../../assets/icons/yoroi-logo-icon.svg';
import { CardanoWalletContract } from '../CardanoWalletContract';

export const Eternl: CardanoWalletContract = {
  connectWallet(): Observable<boolean | React.ReactNode> {
    if (!cardano?.eternl) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return from(cardano.eternl.enable().then(() => true)) as any;
  },
  definition: 'default',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  walletSupportedFeatures: { createPool: true },
  name: 'Eternl',
  icon: <YoroiLogo />,
};
