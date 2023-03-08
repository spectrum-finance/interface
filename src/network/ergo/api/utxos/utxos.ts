import {
  combineLatest,
  debounceTime,
  mapTo,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { networkContext$ } from '../networkContext/networkContext';
import { mempoolRawOperations$ } from '../operations/history/v2/operationsHistory';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const utxos$ = connectedWalletChange$.pipe(
  switchMap((selectedWallet) =>
    combineLatest([mempoolRawOperations$, networkContext$]).pipe(
      debounceTime(100),
      mapTo(selectedWallet),
    ),
  ),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getUtxos() : of([]),
  ),
  publishReplay(1),
  refCount(),
);
