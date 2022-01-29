import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { AmmPool } from '../common/models/AmmPool';
import { selectedNetwork$ } from '../network/network';

export const ammPools$ = selectedNetwork$.pipe(
  switchMap((network) => network.ammPools$),
  publishReplay(1),
  refCount(),
);

export const getAmmPoolById = (
  ammPoolId: PoolId,
): Observable<AmmPool | undefined> =>
  ammPools$.pipe(
    map((pools) => pools.find((position) => position.id === ammPoolId)),
  );

const byPair = (xId: string, yId: string) => (p: AmmPool) =>
  (p.x.asset.id === xId || p.y.asset.id === xId) &&
  (p.x.asset.id === yId || p.y.asset.id === yId);
export const getAmmPoolsByPair = (
  xId: string,
  yId: string,
): Observable<AmmPool[]> =>
  ammPools$.pipe(
    map((pools) => pools.filter(byPair(xId, yId))),
    publishReplay(1),
    refCount(),
  );
