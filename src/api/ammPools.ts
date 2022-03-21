import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { applicationConfig } from '../applicationConfig';
import { AmmPool } from '../common/models/AmmPool';
import { selectedNetwork$ } from '../network/network';

const byTvl = (poolA: AmmPool, poolB: AmmPool): number => {
  if (!poolA.tvl) {
    return 1;
  }
  if (!poolB.tvl) {
    return -1;
  }
  return Number(poolB.tvl.value) - Number(poolA.tvl.value);
};

export const ammPools$ = selectedNetwork$.pipe(
  switchMap((network) => network.ammPools$),
  map((pools) =>
    pools.filter(
      (p) =>
        !applicationConfig.hiddenAssets.includes(p.x.asset.id) &&
        !applicationConfig.hiddenAssets.includes(p.y.asset.id) &&
        !applicationConfig.blacklistedPools.includes(p.id),
    ),
  ),
  map((pools) => pools.slice().sort(byTvl)),
  publishReplay(1),
  refCount(),
);

export const getAmmPoolById = (
  ammPoolId: PoolId,
): Observable<AmmPool | undefined> =>
  selectedNetwork$.pipe(
    switchMap((network) => network.ammPools$),
    map((pools) => pools.find((position) => position.id === ammPoolId)),
  );

const byAssetPair = (xId: string, yId: string) => (p: AmmPool) =>
  (p.x.asset.id === xId && p.y.asset.id === yId) ||
  (p.x.asset.id === yId && p.y.asset.id === xId);
export const getAmmPoolsByAssetPair = (
  xId: string,
  yId: string,
): Observable<AmmPool[]> =>
  ammPools$.pipe(
    map((pools) => pools.filter(byAssetPair(xId, yId))),
    publishReplay(1),
    refCount(),
  );
