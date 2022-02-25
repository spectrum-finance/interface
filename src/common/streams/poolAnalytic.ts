import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { DateTime } from 'luxon';
import { from, map, Observable } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { AnalyticsData, LockedAsset } from '../../services/new/analytics';

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
      `${applicationConfig.api}amm/pool/${poolId}/stats`,
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
  from(get24hData(`${applicationConfig.api}amm/pool/${poolId}/stats`)).pipe(
    map((res) => res.data),
  );
