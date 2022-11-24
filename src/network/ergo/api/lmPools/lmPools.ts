import { LmPool as BaseLmPool } from '@ergolabs/ergo-dex-sdk';
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
import { LmPool } from '../../../../common/models/LmPool';
import { aggregatedPoolsAnalyticsDataById24H$ } from '../../../../common/streams/poolAnalytic';
import { mapToAssetInfo } from '../common/assetInfoManager';
import { filterUnavailablePools } from '../common/availablePoolsOrTokens';
import { rawLmPools$ } from '../common/rawLmPools';
import { ErgoLmPool } from './ErgoLmPool';

const toLmPool = (p: BaseLmPool): Observable<LmPool> =>
  combineLatest(
    [p.lq.asset, p.tt.asset, p.vlq.asset, p.reward.asset].map((asset) =>
      mapToAssetInfo(asset.id),
    ),
  ).pipe(
    map(([lq, tt, vlq, reward]) => {
      return new ErgoLmPool(p, {
        lq: lq || p.lq.asset,
        vlq: vlq || p.vlq.asset,
        tt: tt || p.tt.asset,
        reward: reward || p.reward.asset,
      });
    }),
  );

export const allLmPools$ = combineLatest([
  rawLmPools$,
  aggregatedPoolsAnalyticsDataById24H$,
]).pipe(
  switchMap(([rawAmmPools]) =>
    combineLatest(rawAmmPools.map((rap) => toLmPool(rap))).pipe(
      defaultIfEmpty([]),
    ),
  ),
  publishReplay(1),
  refCount(),
);

// export const displayedAmmPools$ = ammPools$.pipe(
//   switchMap((pools) => filterUnavailablePools(pools)),
//   publishReplay(1),
//   refCount(),
// );
