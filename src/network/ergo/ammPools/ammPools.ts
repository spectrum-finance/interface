import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import {
  catchError,
  combineLatest,
  defaultIfEmpty,
  filter,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  retry,
  switchMap,
  zip,
} from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { AmmPool } from '../../../common/models/AmmPool';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../common/streams/poolAnalytic';
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

const toAmmPool = (p: BaseAmmPool): Observable<AmmPool> =>
  getAggregatedPoolAnalyticsDataById24H(p.id).pipe(
    catchError(() => of(undefined)),
    map((poolAnalytics) => new AmmPool(p, poolAnalytics)),
  );

export const ammPools$ = networkContext$.pipe(
  switchMap(() => zip([getNativeNetworkAmmPools(), getNetworkAmmPools()])),
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools.concat(networkPools),
  ),
  catchError(() => of(undefined)),
  filter(Boolean),
  switchMap((pools) =>
    combineLatest(pools.map(toAmmPool)).pipe(defaultIfEmpty([])),
  ),
  publishReplay(1),
  refCount(),
);
