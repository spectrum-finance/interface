import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { DateTime } from 'luxon';
import { defer, from, map, Observable } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';

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
  yearlyFeesPercent: number;
}

export interface AmmAggregatedAnalytics {
  tvl: AnalyticsData;
  volume: AnalyticsData;
}

const get24hData = (url: string): Promise<any> => {
  return axios.get(url, {
    params: {
      from: DateTime.now().minus({ day: 1 }).toMillis(),
    },
  });
};

export const aggregatedAnalyticsData24H$ = defer(() =>
  from(get24hData(`${applicationConfig.api}amm/platform/stats`)).pipe(
    map((res) => res.data),
  ),
);

export const getAggregateAnalyticsDataByFrame = (
  frm?: number,
  to?: number,
): Observable<AmmAggregatedAnalytics> =>
  from(
    axios.get(`${applicationConfig.api}amm/platform/stats`, {
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
      `${applicationConfig.api}amm/pool/${poolId}/stats`,
      {
        params: {
          from: frm,
          to,
        },
      },
    ),
  ).pipe(map((res) => res.data));

export const getAggregatedPoolAnalyticsDataById24H = (
  poolId: PoolId,
): Observable<AmmPoolAnalytics> =>
  from(get24hData(`${applicationConfig.api}amm/pool/${poolId}/stats`)).pipe(
    map((res) => res.data),
  );
