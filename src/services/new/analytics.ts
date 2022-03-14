import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { DateTime } from 'luxon';
import { defer, from, map, Observable, switchMap } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { Currency } from '../../common/models/Currency';
import { networkContext$ } from '../../network/ergo/networkContext/networkContext';

export interface LockedAsset {
  id: string;
  amount: number;
  ticker: string;
  decimals: number;
}

export interface Units {
  currency: CurrencyInfo;
}

export interface CurrencyInfo {
  id: string;
  decimals: number;
}

export interface AnalyticsData {
  currency: Currency;
  value: string;
  units: Units;
  window?: Window;
}

export interface Window {
  from: number;
  to: number;
}

export interface AmmPoolLocksAnalytic {
  readonly poolId: string;
  readonly deadline: number;
  readonly amount: bigint;
  readonly percent: number;
  readonly redeemer: string;
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

export const getPoolLocksAnalyticsById = (
  poolId: PoolId,
): Observable<AmmPoolLocksAnalytic[]> =>
  networkContext$.pipe(
    switchMap((context) =>
      from(
        axios.get<AmmPoolLocksAnalytic[]>(
          `${applicationConfig.api}amm/pool/${poolId}/locks?leastDeadline=${context.height}`,
        ),
      ).pipe(map((res) => res.data)),
    ),
  );
