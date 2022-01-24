import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { AssetLock } from '../common/models/AssetLock';
import { AssetLockAccumulator } from '../common/models/AssetLockAccumulator';
import { selectedNetwork$ } from '../network/network';

export const locks$ = selectedNetwork$.pipe(
  switchMap((network) => network.locks$),
  publishReplay(1),
  refCount(),
);

export const locksAccumulators$: Observable<AssetLockAccumulator[]> =
  locks$.pipe(
    map((locks) =>
      locks.reduce<{ [key: string]: AssetLock[] }>((acc, lock) => {
        if (!acc[lock.pool.id]) {
          acc[lock.pool.id] = [];
        }

        acc[lock.pool.id].push(lock);

        return acc;
      }, {}),
    ),
    map((locksByPoolId) =>
      Object.values(locksByPoolId).map(
        (locks) => new AssetLockAccumulator(locks),
      ),
    ),
    publishReplay(1),
    refCount(),
  );

export const getLocksByPoolId = (poolId: PoolId): Observable<AssetLock[]> =>
  locks$.pipe(map((locks) => locks.filter((l) => l.pool.id === poolId)));

export const getLocksByPool = (
  pool: AmmPool,
): Observable<AssetLock[] | undefined> =>
  locks$.pipe(
    map((locks) => locks.filter((l) => l.lp.asset.id == pool.lp.asset.id)),
  );
