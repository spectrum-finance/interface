import {
  combineLatest,
  debounceTime,
  distinctUntilKeyChanged,
  mapTo,
  of,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { networkContext$ } from '../networkContext/networkContext';
import { inProgressOperations$ } from '../operations/pending/inProgressOperations';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const utxos$ = connectedWalletChange$.pipe(
  switchMap((selectedWallet) =>
    combineLatest([
      inProgressOperations$.pipe(distinctUntilKeyChanged('length')),
      networkContext$,
    ]).pipe(debounceTime(100), mapTo(selectedWallet)),
  ),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getUtxos() : of([]),
  ),
  tap((res) => console.log(res)),
  publishReplay(1),
  refCount(),
);
