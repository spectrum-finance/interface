import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import { DateTime } from 'luxon';
import {
  catchError,
  combineLatest,
  defaultIfEmpty,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { getAggregatedPoolAnalyticsDataById24H } from '../../../../common/streams/poolAnalytic';
import { mapToAssetInfo } from '../common/assetInfoManager';
import {
  filterAvailablePools,
  filterUnavailablePools,
} from '../common/availablePoolsOrTokens';
import { rawAmmPools$ } from '../common/rawAmmPools';
import { getPoolChartDataRaw } from '../poolChart/poolChart';
import { ErgoAmmPool } from './ErgoAmmPool';

const toAmmPool = (p: BaseAmmPool): Observable<AmmPool> =>
  zip([
    getAggregatedPoolAnalyticsDataById24H(p.id).pipe(
      catchError(() => of(undefined)),
    ),
    getPoolChartDataRaw(p.id, {
      from: DateTime.now().minus({ day: 1 }).valueOf(),
    }),
    combineLatest(
      [p.lp.asset, p.x.asset, p.y.asset].map((asset) =>
        mapToAssetInfo(asset.id),
      ),
    ),
  ]).pipe(
    map(([poolAnalytics, rawChartData, [lp, x, y]]) => {
      return new ErgoAmmPool(
        p,
        { lp: lp || p.lp.asset, x: x || p.x.asset, y: y || p.y.asset },
        poolAnalytics,
        rawChartData,
      );
    }),
  );

export const allAmmPools$ = rawAmmPools$.pipe(
  switchMap((pools) =>
    combineLatest(pools.map(toAmmPool)).pipe(defaultIfEmpty([])),
  ),
  publishReplay(1),
  refCount(),
);

export const possibleAmmPools$ = allAmmPools$.pipe(
  switchMap((pools) => filterAvailablePools(pools)),
  publishReplay(1),
  refCount(),
);

export const ammPools$ = allAmmPools$.pipe(
  switchMap((pools) => filterUnavailablePools(pools)),
  publishReplay(1),
  refCount(),
);
