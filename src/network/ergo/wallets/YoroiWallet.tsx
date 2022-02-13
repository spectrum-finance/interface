import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import { from, map, Observable, tap, throwError } from 'rxjs';

import { ReactComponent as YoroiLogo } from '../../../assets/icons/yoroi-logo-icon.svg';
import { Wallet } from '../../common';

const connectWallet = (): Observable<boolean> => {
  if (!cardano) {
    return throwError(() => new Error('EXTENSION_NOT_FOUND'));
  }
  return from(window.ergo_request_read_access()).pipe(
    tap(() => (window.yoroi = ergo)),
  );
};

const getUtxos = (): Observable<ErgoBox[]> =>
  from(window.yoroi.get_utxos()).pipe(
    map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
    map((data) => data ?? []),
  );

export const YoroiWallet: Wallet = {
  name: 'Yoroi',
  icon: <YoroiLogo />,
  experimental: false,
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  connectWallet,
  getUtxos,
};
