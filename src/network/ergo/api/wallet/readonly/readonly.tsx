import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import {
  filter,
  from,
  map,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { explorer } from '../../../../../services/explorer';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { ReactComponent as ReadonlyLogo } from './readonly-logo-icon.svg';

export const READ_ONLY_ADDRESS_KEY = 'readonly-ergopay-wallet';

export const setReadonlyAddress = (address: string): void =>
  localStorageManager.set<string>(READ_ONLY_ADDRESS_KEY, address);

export const hasReadonlyAddress = (): boolean =>
  !!localStorageManager.get(READ_ONLY_ADDRESS_KEY);

const readOnlyAddress$ = localStorageManager
  .getStream<string>(READ_ONLY_ADDRESS_KEY)
  .pipe(filter(Boolean), publishReplay(1), refCount());

export const ReadonlyWallet: ErgoWalletContract = {
  name: 'Read-only Wallet',
  hidden: true,
  icon: <ReadonlyLogo />,
  previewIcon: <ReadonlyLogo width={21} height={21} />,
  connectWallet: () => of(true),
  getUtxos: () =>
    readOnlyAddress$.pipe(
      switchMap((address) =>
        from(explorer.searchUnspentBoxesByAddress(address)),
      ),
      map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
      map((data) => data ?? []),
    ),
  getUsedAddresses: () => readOnlyAddress$.pipe(map((address) => [address])),
  getUnusedAddresses: () => of([]),
  getChangeAddress: () => readOnlyAddress$,
  getAddresses: () => readOnlyAddress$.pipe(map((address) => [address])),
  sign: () => ({} as any),
  signInput: () => ({} as any),
  submitTx: () => ({} as any),
  extensionLink: '',
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
};
