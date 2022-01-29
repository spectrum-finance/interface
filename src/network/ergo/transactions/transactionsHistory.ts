import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { Address, AugErgoTx } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  first,
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

const parseOp = (
  tx: AugErgoTx,
  address: Address,
): AmmDexOperation | undefined =>
  networkHistory['parseOp'](tx, true, [address]);

const getTxsByAddress = (
  address: string,
  limit = 50,
  offset = 0,
  prevOperationsCount = 0,
): Observable<AmmDexOperation[]> => {
  return from(
    networkHistory.network.getTxsByAddress(address, {
      offset,
      limit: TX_LIMIT,
    }),
  ).pipe(
    map<
      [AugErgoTx[], number],
      [AugErgoTx[], number, AmmDexOperation[], number]
    >(([txs, txsCount]) => {
      const ops = txs.map((tx) => parseOp(tx, address)).filter(Boolean);

      return [txs, txsCount, ops as any, ops.length];
    }),
    switchMap(([txs, , ops, opsCount]) => {
      if (txs.length < TX_LIMIT || opsCount + prevOperationsCount > limit) {
        return of(ops);
      }
      return getTxsByAddress(
        address,
        limit,
        offset + TX_LIMIT,
        opsCount + prevOperationsCount,
      ).pipe(map((newOps) => ops.concat(newOps)));
    }),
  );
};

export const getTxHistory = (limit: number): Observable<AmmDexOperation[]> =>
  addresses$.pipe(
    switchMap((addresses) =>
      combineLatest(addresses.map((a) => getTxsByAddress(a, limit))),
    ),
    map((txs) => txs.flatMap((tx) => tx)),
    first(),
    publishReplay(1),
    refCount(),
  );
