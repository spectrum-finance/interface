import { mkLockParser } from '@ergolabs/ergo-dex-sdk';
import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { AugErgoBox } from '@ergolabs/ergo-sdk/build/main/network/models';
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

import { AssetLock } from '../../../common/models/AssetLock';
import { explorer } from '../../../services/explorer';
import { addresses$ } from '../addresses/addresses';
import { networkContext$ } from '../networkContext/networkContext';
import { pools$ } from '../pools/pools';
import { TX_LIMIT } from '../transactions/common';

const getAllByAddress = (
  address: string,
  offset = 0,
): Observable<AugErgoBox[]> => {
  return from(
    explorer.getTxsByAddress(address, {
      offset,
      limit: TX_LIMIT,
    }),
  ).pipe(
    switchMap(([txs, count]) => {
      return count < TX_LIMIT
        ? of(txs.flatMap((tx) => tx.outputs))
        : getAllByAddress(address, offset + TX_LIMIT).pipe(
            map((newTxs) => txs.flatMap((tx) => tx.outputs).concat(newTxs)),
          );
    }),
  );
};

const parser = mkLockParser();

const tokenLocks$: Observable<TokenLock[]> = addresses$.pipe(
  switchMap((addresses) => combineLatest(addresses.map(getAllByAddress))),
  map((txBoxes) => txBoxes.flatMap((txBox) => txBox)),
  map(
    (txBoxes) =>
      txBoxes
        .map((txBox) => parser.parseTokenLock(txBox))
        .filter(Boolean) as any,
  ),
  publishReplay(1),
  refCount(),
);

export const locks$: Observable<AssetLock[]> = combineLatest([
  pools$,
  tokenLocks$,
  networkContext$,
]).pipe(
  map(([pools, tokenLocks, networkContext]) =>
    tokenLocks.map(
      (tl) =>
        new AssetLock(
          pools.find((p) => p.lp.asset.id === tl.lockedAsset.asset.id)!,
          tl,
          networkContext.height,
        ),
    ),
  ),
);
