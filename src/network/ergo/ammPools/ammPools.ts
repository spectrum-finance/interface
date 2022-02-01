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

import { AmmPool } from '../../../common/models/AmmPool';
import { appTick$ } from '../../../common/streams/appTick';
import { nativeNetworkPools, networkPools } from './common';

const BlacklistedAmmPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

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
    nativeNetworkPools
      .concat(networkPools)
      .filter((p) => p.id != BlacklistedAmmPoolId),
  ),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);
