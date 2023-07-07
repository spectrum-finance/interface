import { Observable, of, publishReplay, refCount, switchMap, tap } from 'rxjs';

import { Address } from '../../../../common/types';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const getAddresses = (): Observable<Address[]> =>
  connectedWalletChange$.pipe(
    // tap(console.log, console.log),
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getAddresses() : of([]),
    ),
    // tap(console.log, console.log),
    publishReplay(1),
    refCount(),
  );

export const getUsedAddresses = (): Observable<Address[] | undefined> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getUsedAddresses() : of(undefined),
    ),
    publishReplay(1),
    refCount(),
  );

export const getUnusedAddresses = (): Observable<Address[] | undefined> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getUnusedAddresses() : of(undefined),
    ),
    publishReplay(1),
    refCount(),
  );

export const getChangeAddress = (): Observable<Address | undefined> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getChangeAddress() : of(undefined),
    ),
    tap(console.log, console.log),
    publishReplay(1),
    refCount(),
  );
