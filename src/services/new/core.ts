import { first, publishReplay, refCount, switchMap } from 'rxjs';

import { utxos$ as ergoUtxos$ } from '../../networks/ergo/ergo';
import { selectedNetwork$ } from './network';

export const nativeToken$ = selectedNetwork$.pipe(
  switchMap((n) => n.nativeToken$),
  publishReplay(1),
  refCount(),
);

export const nativeTokenBalance$ = selectedNetwork$.pipe(
  switchMap((n) => n.nativeTokenBalance$),
  publishReplay(1),
  refCount(),
);

export const walletState$ = selectedNetwork$.pipe(
  switchMap((n) => n.walletState$),
  publishReplay(1),
  refCount(),
);

export const isWalletLoading$ = selectedNetwork$.pipe(
  switchMap((n) => n.isWalletLoading$),
  publishReplay(1),
  refCount(),
);

export const isWalletSetuped$ = selectedNetwork$.pipe(
  switchMap((n) => n.isWalletSetuped$),
  publishReplay(1),
  refCount(),
);

export const utxos$ = ergoUtxos$;

export const connectWallet = () => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.connectWallet());
};
