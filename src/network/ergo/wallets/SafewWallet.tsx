import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import { catchError, from, map, Observable, of, tap, throwError } from 'rxjs';

import { ReactComponent as SafewLogo } from '../../../assets/icons/safew-logo-icon.svg';
import { Wallet } from '../../common';

const connectWallet = (): Observable<any> => {
  if (!ergoConnector?.safew) {
    return throwError(() => new Error('EXTENSION_NOT_FOUND'));
  }
  return from(ergoConnector.safew.connect()).pipe(
    tap(() => (window.safew = Object.freeze(new SafewErgoApi()))),
    catchError(() => of(true)),
  );
};

const getUtxos = (): Observable<ErgoBox[]> =>
  from(window.safew.get_utxos()).pipe(
    map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
    map((data) => data ?? []),
  );

export const SafewWallet: Wallet = {
  name: 'Safew',
  icon: <SafewLogo />,
  experimental: true,
  extensionLink: 'https://github.com/ThierryM1212/SAFEW/releases',
  connectWallet,
  getUtxos,
};
