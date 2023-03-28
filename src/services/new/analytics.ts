import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import { from, map, Observable, switchMap } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { Currency } from '../../common/models/Currency';
import { networkContext$ } from '../../network/ergo/api/networkContext/networkContext';

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

export interface AmmPoolLocksAnalytic {
  readonly poolId: string;
  readonly deadline: number;
  readonly amount: bigint;
  readonly percent: number;
  readonly redeemer: string;
}

export const getPoolLocksAnalyticsById = (
  poolId: PoolId,
): Observable<AmmPoolLocksAnalytic[]> =>
  networkContext$.pipe(
    switchMap((context) =>
      from(
        axios.get<AmmPoolLocksAnalytic[]>(
          `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pool/${poolId}/locks?leastDeadline=${context.height}`,
        ),
      ).pipe(map((res) => res.data)),
    ),
  );
