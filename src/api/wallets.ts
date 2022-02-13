import { first, map, publishReplay, refCount, switchMap } from 'rxjs';

import { Wallet } from '../network/common';
import { selectedNetwork$ } from '../network/network';

export const wallets$ = selectedNetwork$.pipe(
  map((n) => n.wallets),
  publishReplay(1),
  refCount(),
);

export const connectWallet = (wallet: Wallet) =>
  selectedNetwork$.pipe(
    switchMap((n) => n.connectWallet(wallet)),
    first(),
  );
