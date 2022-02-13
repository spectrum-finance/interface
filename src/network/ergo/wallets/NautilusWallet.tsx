import React from 'react';
import { Observable, of, throwError } from 'rxjs';

import { ReactComponent as NautilusLogo } from '../../../assets/icons/nautilus-logo-icon.svg';
import { Wallet } from '../../common';

const connectWallet = (): Observable<any> => {
  if (!ergoConnector?.nautilus) {
    return throwError(() => new Error());
  }

  return of(1);
};

export const NautilusWallet: Wallet = {
  name: 'Nautilus',
  icon: <NautilusLogo />,
  experimental: true,
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
  connectWallet,
};
