import {
  first,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Wallet, WalletState } from '../../network/common/Wallet';
import { selectedNetwork$ } from '../common/network';

export const wallets$ = selectedNetwork$.pipe(
  map((n) => n.availableWallets),
  publishReplay(1),
  refCount(),
);

export const selectedWallet$ = selectedNetwork$.pipe(
  switchMap((n) => n.selectedWallet$),
  publishReplay(1),
  refCount(),
);

export const selectedWalletState$ = selectedNetwork$.pipe(
  switchMap((n) => n.walletState$),
  publishReplay(1),
  refCount(),
);

export const isWalletSetuped$ = selectedWalletState$.pipe(
  map(
    (state) =>
      state === WalletState.CONNECTED || state === WalletState.CONNECTING,
  ),
  publishReplay(1),
  refCount(),
);

export const connectWallet = (wallet: Wallet): Observable<any> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.connectWallet(wallet)),
    first(),
  );

export const disconnectWallet = (): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.disconnectWallet());
};
