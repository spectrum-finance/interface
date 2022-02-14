import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import Cookies from 'js-cookie';
import React from 'react';
import { from, map, Observable, tap, throwError } from 'rxjs';

import { ReactComponent as YoroiLogo } from '../../../assets/icons/yoroi-logo-icon.svg';
import { ArgsProps } from '../../../ergodex-cdk';
import { Wallet } from '../../common';

const MESSAGE_COOKIE = 'YOROI_MESSAGE_COOKIE';

const getNotification = (): ArgsProps | undefined => {
  if (Cookies.get(MESSAGE_COOKIE)) {
    return undefined;
  }
  Cookies.set(MESSAGE_COOKIE, 'true', { expires: 1 });
  return {
    message: 'Yoroi Wallet tip',
    description:
      'Keep Yoroi Wallet extension window open, when you use ErgoDEX. So that it will sync faster.',
  };
};

const onDisconnect = (): void => Cookies.remove(MESSAGE_COOKIE);

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
  getNotification,
  onDisconnect,
};
