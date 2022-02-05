import {
  combineLatest,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { appTick$ } from '../../../common/streams/appTick';
import { nativeNetworkPools, networkPools } from './common';

const getNativeNetworkAmmPools = () =>
  from(nativeNetworkPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
  );

const getNetworkAmmPools = () =>
  from(networkPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
  );

export const ammPools$ = appTick$.pipe(
  switchMap(() =>
    combineLatest([getNativeNetworkAmmPools(), getNetworkAmmPools()]),
  ),
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools.concat(networkPools),
  ),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);
