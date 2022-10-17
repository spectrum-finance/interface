import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk';
import {
  combineLatest,
  defaultIfEmpty,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import {
  aggregatedPoolsAnalyticsDataById24H$,
  AmmPoolAnalytics,
} from '../../../../common/streams/poolAnalytic';
import { mapToAssetInfo } from '../common/assetInfoManager';
import { filterUnavailablePools } from '../common/availablePoolsOrTokens';
import { rawAmmPools$ } from '../common/rawAmmPools';
import { ErgoAmmPool } from './ErgoAmmPool';

const toAmmPool = (
  p: BaseAmmPool,
  analytic: AmmPoolAnalytics,
): Observable<AmmPool> =>
  combineLatest(
    [p.lp.asset, p.x.asset, p.y.asset].map((asset) => mapToAssetInfo(asset.id)),
  ).pipe(
    map(([lp, x, y]) => {
      return new ErgoAmmPool(
        p,
        { lp: lp || p.lp.asset, x: x || p.x.asset, y: y || p.y.asset },
        analytic,
      );
    }),
  );

export const allAmmPools$ = combineLatest([
  rawAmmPools$,
  aggregatedPoolsAnalyticsDataById24H$,
]).pipe(
  switchMap(([rawAmmPools, analytics]) =>
    combineLatest(
      rawAmmPools.map((rap) => toAmmPool(rap, analytics[rap.id])),
    ).pipe(defaultIfEmpty([])),
  ),
  publishReplay(1),
  refCount(),
);

export const ammPools$ = allAmmPools$.pipe(
  map((ammPools) =>
    ammPools.filter(
      (ap) =>
        !applicationConfig.blacklistedPools.includes(ap.id) &&
        !applicationConfig.hiddenAssets.includes(ap.x.asset.id) &&
        !applicationConfig.hiddenAssets.includes(ap.y.asset.id),
    ),
  ),
  publishReplay(1),
  refCount(),
);

export const displayedAmmPools$ = ammPools$.pipe(
  switchMap((pools) => filterUnavailablePools(pools)),
  publishReplay(1),
  refCount(),
);
