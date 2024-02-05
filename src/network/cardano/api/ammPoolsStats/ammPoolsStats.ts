import { HexString } from '@spectrumlabs/cardano-dex-sdk';
import axios from 'axios';
import keyBy from 'lodash/keyBy';
import {
  catchError,
  exhaustMap,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
} from 'rxjs';

import { PoolId } from '../../../../common/types';
import { Dictionary } from '../../../../common/utils/Dictionary';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { networkContext$ } from '../networkContext/networkContext';

export interface AmmPoolAnalyticsAssetInfo {
  readonly amount: number;
  readonly asset: {
    readonly currencySymbol: HexString;
    readonly tokenName: string;
  };
}

export interface AmmPoolAnalytics {
  readonly id: PoolId;
  readonly tvl: number | null;
  readonly volume: number | null;
  readonly yearlyFeesPercent: number | undefined;
  readonly lockedX: AmmPoolAnalyticsAssetInfo;
  readonly lockedY: AmmPoolAnalyticsAssetInfo;
  readonly lockedLQ: AmmPoolAnalyticsAssetInfo;
  readonly poolFeeNum: number;
}

export interface AmmPoolAnalyticsV3 {
  readonly id: PoolId;
  readonly x: string;
  readonly xAmount: string;
  readonly y: string;
  readonly yAmount: string;
  readonly lq: string;
  readonly lqAmount: string;
  readonly poolFeeNum: number;
  readonly poolFeeNumX: number;
  readonly treasuryX: string;
  readonly treasuryY: string;
}

export const ammPoolsStats$: Observable<Dictionary<AmmPoolAnalytics>> =
  networkContext$.pipe(
    exhaustMap(() =>
      from(
        axios.get<AmmPoolAnalytics[]>(
          `${cardanoNetworkData.analyticUrl}pools/overview`,
          {
            params: {
              after: 0,
            },
          },
        ),
      ),
    ),
    map((res) => res.data),
    catchError(() => of([])),
    map((analytics: AmmPoolAnalytics[]) => keyBy(analytics, (a) => a.id)),
    publishReplay(1),
    refCount(),
  );
