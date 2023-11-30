import { HexString } from '@teddyswap/cardano-dex-sdk';
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
  readonly poolFeeDenum: number;
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
