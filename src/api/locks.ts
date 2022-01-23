import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { AssetLock } from '../common/models/AssetLock';
import { selectedNetwork$ } from '../network/network';

export const locks$ = selectedNetwork$.pipe(
  switchMap((network) => network.locks$),
  publishReplay(1),
  refCount(),
);

export const getLocksByPool = (pool: AmmPool): Observable<AssetLock[]> =>
  locks$.pipe(map((locks) => locks.filter((l) => l.pool.id === pool.id)));
