import uniq from 'lodash/uniq';
import {
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { Address } from '../../../../common/types';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const getAddresses = (): Observable<Address[]> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet
        ? zip(
            selectedWallet.getAddresses(),
            selectedWallet.getChangeAddress(),
          ).pipe(
            map(([addresses, changeAddress]) =>
              uniq(addresses.concat(changeAddress)),
            ),
          )
        : of([]),
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

export const getChangeAddress = (): Observable<Address | undefined> =>
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getChangeAddress() : of(undefined),
    ),
    publishReplay(1),
    refCount(),
  );
