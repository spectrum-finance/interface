import React from 'react';
import { Observable, of, throwError } from 'rxjs';

import { ReactComponent as YoroiLogo } from '../../../assets/icons/yoroi-logo-icon.svg';
import { Wallet } from '../../common';

const connectWallet = (): Observable<any> => {
  if (!cardano) {
    return throwError(() => new Error());
  }
  return of(1);
};

export const YoroiWallet: Wallet = {
  name: 'Yoroi',
  icon: <YoroiLogo />,
  experimental: false,
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  connectWallet,
};
