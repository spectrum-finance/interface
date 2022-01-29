import {
  combineLatest,
  defer,
  from,
  interval,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { UPDATE_TIME } from '../../../services/new/core';
import { nativeNetworkPools, networkPools } from './common';

const BlacklistedPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

const nativeNetworkPools$ = defer(() =>
  from(nativeNetworkPools().getAll({ limit: 100, offset: 0 })),
).pipe(
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

const networkPools$ = defer(() =>
  from(networkPools().getAll({ limit: 100, offset: 0 })),
).pipe(
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

export const ammPools$ = interval(UPDATE_TIME)
  .pipe(startWith(0))
  .pipe(
    switchMap(() => combineLatest([nativeNetworkPools$, networkPools$])),
    map(([nativeNetworkPools, networkPools]) =>
      nativeNetworkPools
        .concat(networkPools)
        .filter((p) => p.id != BlacklistedPoolId),
    ),
    map((pools) => pools.map((p) => new AmmPool(p))),
    publishReplay(1),
    refCount(),
  );
