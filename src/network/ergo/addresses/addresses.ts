import { filter, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { WalletState } from '../../common';
import { selectedWallet$, selectedWalletState$ } from '../wallets';

export const getAddresses = (): Observable<string[]> =>
  selectedWalletState$.pipe(
    filter((state) => state === WalletState.CONNECTED),
    switchMap(() => selectedWallet$.pipe(filter(Boolean))),
    switchMap((wallet) => wallet.getAddresses()),
  );

export const getUsedAddresses = (): Observable<string[]> =>
  selectedWalletState$.pipe(
    filter((state) => state === WalletState.CONNECTED),
    switchMap(() => selectedWallet$.pipe(filter(Boolean))),
    switchMap((wallet) => wallet.getUsedAddresses()),
  );

export const getUnusedAddresses = (): Observable<string[]> =>
  selectedWalletState$.pipe(
    filter((state) => state === WalletState.CONNECTED),
    switchMap(() => selectedWallet$.pipe(filter(Boolean))),
    switchMap((wallet) => wallet.getUnusedAddresses()),
  );

export const addresses$: Observable<string[]> = appTick$.pipe(
  switchMap(() => getAddresses()),
  publishReplay(1),
  refCount(),
);
