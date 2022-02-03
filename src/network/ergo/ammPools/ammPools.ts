import {
  combineLatest,
  debounceTime,
  defer,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { AmmPool } from '../../../common/models/AmmPool';
import { appTick$ } from '../../../common/streams/appTick';
import { nativeNetworkPools, networkPools } from './common';

const nativeNetworkAmmPools$ = appTick$.pipe(
  switchMap(() =>
    defer(() => from(nativeNetworkPools().getAll({ limit: 100, offset: 0 }))),
  ),
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

const networkAmmPools$ = appTick$.pipe(
  switchMap(() =>
    defer(() => from(networkPools().getAll({ limit: 100, offset: 0 }))),
  ),
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

export const ammPools$ = combineLatest([
  nativeNetworkAmmPools$,
  networkAmmPools$,
]).pipe(
  debounceTime(200),
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools.concat(networkPools),
  ),
  map((pools) =>
    pools.filter(
      (p) =>
        !applicationConfig.hiddenAssets.includes(p.x.asset.id) &&
        !applicationConfig.hiddenAssets.includes(p.y.asset.id) &&
        !applicationConfig.blacklistedPools.includes(p.id),
    ),
  ),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);
