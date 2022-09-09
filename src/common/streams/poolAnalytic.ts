import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import keyBy from 'lodash/keyBy';
import { DateTime } from 'luxon';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { networkContext$ } from '../../network/ergo/api/networkContext/networkContext';
import { AnalyticsData, LockedAsset } from '../../services/new/analytics';
import { Currency } from '../models/Currency';
import { Dictionary } from '../utils/Dictionary';

export interface AmmPoolAnalytics {
  id: PoolId;
  lockedX: LockedAsset;
  lockedY: LockedAsset;
  tvl: AnalyticsData;
  volume: AnalyticsData;
  fees: AnalyticsData;
  yearlyFeesPercent: number;
}

export const getAggregatedPoolAnalyticsDataById = (
  poolId: PoolId,
  frm?: number,
  to?: number,
): Observable<AmmPoolAnalytics> =>
  from(
    axios.get<AmmPoolAnalytics>(
      `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pool/${poolId}/stats`,
      {
        params: {
          from: frm,
          to,
        },
      },
    ),
  ).pipe(map((res) => res.data));

const get24hData = (url: string): Promise<any> => {
  return axios.get(url, {
    params: {
      from: DateTime.now().minus({ day: 1 }).toMillis(),
    },
  });
};

export const getAggregatedPoolAnalyticsDataById24H = (
  poolId: PoolId,
): Observable<AmmPoolAnalytics> =>
  from(
    get24hData(
      `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pool/${poolId}/stats`,
    ),
  ).pipe(
    map((res) => ({
      ...res.data,
      tvl: res.data.tvl
        ? {
            ...res.data.tvl,
            currency: new Currency(BigInt(res.data.tvl.value), {
              decimals: 2,
              id: 'USD',
            }),
          }
        : undefined,
    })),
  );

export const aggregatedPoolsAnalyticsDataById24H$: Observable<
  Dictionary<AmmPoolAnalytics>
> = networkContext$.pipe(
  switchMap(() =>
    from(
      get24hData(
        `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pools/stats`,
      ),
    ).pipe(catchError(() => of({}))),
  ),
  map((res) => res.data),
  map((analytics: AmmPoolAnalytics[]) => keyBy(analytics, (a) => a.id)),
  publishReplay(1),
  refCount(),
);
