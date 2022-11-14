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

import { ReactComponent as ErgoLogo } from '../../../../../assets/icons/ergo-logo-icon.svg';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { explorer } from '../../../../../services/explorer';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
export const ERGOPAY_ADDRESS_KEY = 'ergopay-wallet';

export const setErgopayAddress = (address: string): void =>
  localStorageManager.set<string>(ERGOPAY_ADDRESS_KEY, address);

const ergopayAddress$ = localStorageManager
  .getStream<string>(ERGOPAY_ADDRESS_KEY)
  .pipe(filter(Boolean), publishReplay(1), refCount());

export const ErgopayWallet: ErgoWalletContract = {
  name: 'ErgoPay',
  icon: <ErgoLogo />,
  hidden: true,
  previewIcon: <ErgoLogo width={21} height={21} />,
  connectWallet: () => of(true),
  getUtxos: () =>
    ergopayAddress$.pipe(
      switchMap((address) =>
        from(explorer.searchUnspentBoxesByAddress(address)),
      ),
      map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
      map((data) => data ?? []),
    ),
  getUsedAddresses: () => ergopayAddress$.pipe(map((address) => [address])),
  getUnusedAddresses: () => of([]),
  getChangeAddress: () => ergopayAddress$,
  getAddresses: () => ergopayAddress$.pipe(map((address) => [address])),
  sign: () => ({} as any),
  signInput: () => ({} as any),
  submitTx: () => ({} as any),
  extensionLink: '',
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
};
