import { TokenLock } from '@ergolabs/ergo-dex-sdk/build/main/security/entities';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { selectedNetwork$ } from '../network/network';

export const locks$ = selectedNetwork$.pipe(
  switchMap((network) => network.locks$),
  publishReplay(1),
  refCount(),
);

export const getLockByPool = (
  pool: AmmPool,
): Observable<TokenLock[] | undefined> =>
  locks$.pipe(
    map((locks) =>
      locks.filter((l) => l.lockedAsset.asset.id === pool.lp.asset.id),
    ),
  );
