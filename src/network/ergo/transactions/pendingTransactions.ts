import { AugErgoTx } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import networkHistory from '../../../services/networkHistory';
import { addresses$ } from '../addresses/addresses';
import { TX_LIMIT } from './common';

const getUTxsByAddress = (
  address: string,
  offset = 0,
): Observable<AugErgoTx[]> => {
  return from(
    networkHistory.network.getUTxsByAddress(address, {
      offset,
      limit: TX_LIMIT,
    }),
  ).pipe(
    switchMap(([txs, count]) => {
      return count < TX_LIMIT
        ? of(txs)
        : getUTxsByAddress(address, offset + TX_LIMIT).pipe(
            map((newTxs) => txs.concat(newTxs)),
          );
    }),
  );
};

const uTxs$: Observable<AugErgoTx[]> = addresses$.pipe(
  switchMap((addresses) => combineLatest(addresses.map(getUTxsByAddress))),
  map((uTxs) => uTxs.flatMap((i) => i)),
  publishReplay(1),
  refCount(),
);

export const pendingTransactionsCount$ = uTxs$.pipe(
  map((uTxs) => uTxs.length),
  publishReplay(1),
  refCount(),
);
