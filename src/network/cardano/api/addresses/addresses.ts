import { Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { Address } from '../../../../common/types';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const getAddresses = (): Observable<Address[]> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getAddresses() : of([]),
    ),
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
