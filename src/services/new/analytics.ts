import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { DateTime } from 'luxon';
import { defer, from, map, Observable } from 'rxjs';

export interface LockedAsset {
  id: string;
  amount: number;
  ticker: string;
  decimals: number;
}

export interface Units {
  currency: Currency;
}

export interface Currency {
  id: string;
  decimals: number;
}

export interface AnalyticsData {
  value: string;
  units: Units;
  window?: Window;
}

export interface Window {
  from: number;
  to: number;
}

export interface AmmPoolAnalytics {
  id: PoolId;
  lockedX: LockedAsset;
  lockedY: LockedAsset;
  tvl: AnalyticsData;
  volume: AnalyticsData;
  fees: AnalyticsData;
}

export interface AmmAggregatedAnalytics {
  tvl: AnalyticsData;
  volume: AnalyticsData;
}

export const aggregatedAnalyticsData24H$ = defer(() =>
  from(
    axios.get('/amm/platform/stats', {
      params: {
        from: DateTime.now().startOf('day').minus({ hour: 24 }).toMillis(),
        to: DateTime.now().toMillis(),
      },
    }),
  ).pipe(map((res) => res.data)),
);

export const getAggregateAnalyticsDataByFrame = (
  frm?: number,
  to?: number,
): Observable<AmmAggregatedAnalytics> =>
  from(
    axios.get('https://api.ergodex.io/v1/amm/platform/stats', {
      params: {
        from: frm,
        to,
      },
    }),
  ).pipe(map((res) => res.data));

export const getAggregatedPoolAnalyticsDataById = (
  poolId: PoolId,
  frm?: number,
  to?: number,
): Observable<AmmPoolAnalytics> =>
  from(
    axios.get<AmmPoolAnalytics>(
      `https://api.ergodex.io/v1/amm/pool/${poolId}/stats`,
      {
        params: {
          from: frm,
          to,
        },
      },
    ),
  ).pipe(map((res) => res.data));
