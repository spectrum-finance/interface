import React from 'react';
import { from, Observable, throwError } from 'rxjs';

import { ReactComponent as FlintLogo } from '../../../../../assets/icons/flint-logo-icon.svg';
import { CardanoWalletContract } from '../CardanoWalletContract';

export const Flint: CardanoWalletContract = {
  connectWallet(): Observable<boolean | React.ReactNode> {
    if (!cardano?.flint) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return from(cardano.flint.enable().then(() => true)) as any;
  },
  definition: 'default',
  extensionLink:
    'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj?hl=en',
  walletSupportedFeatures: { createPool: true },
  name: 'FlintWallet',
  icon: <FlintLogo width={26} height={26} />,
};
