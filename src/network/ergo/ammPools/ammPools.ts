import { from, map, publishReplay, refCount, switchMap, tap, zip } from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { appTick$ } from '../../../common/streams/appTick';
import { networkContext$ } from '../networkContext/networkContext';
import { nativeNetworkPools, networkPools } from './common';

const getNativeNetworkAmmPools = () =>
  from(nativeNetworkPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
  );

const getNetworkAmmPools = () =>
  from(networkPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
  );

export const ammPools$ = networkContext$.pipe(
  switchMap(() => zip([getNativeNetworkAmmPools(), getNetworkAmmPools()])),
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools.concat(networkPools),
  ),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);
