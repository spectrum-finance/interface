import {
  filter,
  first,
  mapTo,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Wallet, WalletState } from '../network/common';
import { selectedNetwork$ } from '../network/network';

export const wallets$ = selectedNetwork$.pipe(
  switchMap((n) => n.wallets$),
  publishReplay(1),
  refCount(),
);

export const selectedWallet$ = selectedNetwork$.pipe(
  switchMap((n) => n.selectedWallet$),
  publishReplay(1),
  refCount(),
);

export const selectedWalletState$ = selectedNetwork$.pipe(
  switchMap((n) => n.selectedWalletState$),
  publishReplay(1),
  refCount(),
);

export const isWalletSetuped$ = selectedWalletState$.pipe(
  filter(
    (state) =>
      state === WalletState.CONNECTED || state === WalletState.CONNECTING,
  ),
  mapTo(true),
  publishReplay(1),
  refCount(),
);

export const connectWallet = (wallet: Wallet): Observable<any> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.connectWallet(wallet)),
    first(),
  );
