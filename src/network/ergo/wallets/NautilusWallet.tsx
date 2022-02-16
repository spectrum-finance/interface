import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import { catchError, from, map, Observable, of, tap, throwError } from 'rxjs';

import { ReactComponent as NautilusLogo } from '../../../assets/icons/nautilus-logo-icon.svg';
import { Wallet } from '../../common';

const connectWallet = (): Observable<any> => {
  if (!ergoConnector?.nautilus) {
    return throwError(() => new Error('EXTENSION_NOT_FOUND'));
  }
  return from(ergoConnector.nautilus.connect()).pipe(
    tap(() => (window.nautilus = Object.freeze(new NautilusErgoApi()))),
    catchError(() => of(false)),
  );
};

const getUtxos = (): Observable<ErgoBox[]> =>
  from(window.nautilus.get_utxos()).pipe(
    map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
    map((data) => data ?? []),
  );

export const NautilusWallet: Wallet = {
  name: 'Nautilus',
  icon: <NautilusLogo />,
  experimental: true,
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
  connectWallet,
  getUtxos,
};
