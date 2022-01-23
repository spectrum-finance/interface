import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { AssetLock } from '../common/models/AssetLock';
import { selectedNetwork$ } from '../network/network';

export const locks$ = selectedNetwork$.pipe(
  switchMap((network) => network.locks$),
  publishReplay(1),
  refCount(),
);

export const getLockByPool = (
  pool: AmmPool,
): Observable<AssetLock | undefined> =>
  locks$.pipe(map((locks) => locks.find((l) => l.pool.id === pool.id)));
