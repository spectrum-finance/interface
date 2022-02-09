import {
  catchError,
  filter,
  from,
  map,
  of,
  publishReplay,
  refCount,
  retry,
  switchMap,
  zip,
} from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { AmmPool } from '../../../common/models/AmmPool';
import { networkContext$ } from '../networkContext/networkContext';
import { nativeNetworkPools, networkPools } from './common';

const getNativeNetworkAmmPools = () =>
  from(nativeNetworkPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
    retry(applicationConfig.requestRetryCount),
  );

const getNetworkAmmPools = () =>
  from(networkPools().getAll({ limit: 100, offset: 0 })).pipe(
    map(([pools]) => pools),
    retry(applicationConfig.requestRetryCount),
  );

export const ammPools$ = networkContext$.pipe(
  switchMap(() => zip([getNativeNetworkAmmPools(), getNetworkAmmPools()])),
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools.concat(networkPools),
  ),
  catchError(() => of(undefined)),
  filter(Boolean),
  map((pools) => pools.map((p) => new AmmPool(p))),
  publishReplay(1),
  refCount(),
);
