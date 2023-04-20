import { PoolId } from '@ergolabs/ergo-dex-sdk';
import axios from 'axios';
import keyBy from 'lodash/keyBy';
import { DateTime } from 'luxon';
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

import { applicationConfig } from '../../../../applicationConfig';
import { Dictionary } from '../../../../common/utils/Dictionary';
import { LockedAsset } from '../../../../services/new/analytics';
import { AnalyticsData } from '../common/AnalyticsData';
import { networkContext$ } from '../networkContext/networkContext';

export interface AmmPoolAnalytics {
  id: PoolId;
  lockedX: LockedAsset;
  lockedY: LockedAsset;
  tvl: AnalyticsData;
  volume: AnalyticsData;
  fees: AnalyticsData;
  yearlyFeesPercent: number;
}

export const ammPoolsStats$: Observable<Dictionary<AmmPoolAnalytics>> =
  networkContext$.pipe(
    exhaustMap(() =>
      from(
        axios.get<AmmPoolAnalytics[]>(
          `${applicationConfig.networksSettings.ergo.analyticUrl}amm/pools/stats`,
          {
            params: {
              from: DateTime.now().minus({ day: 1 }).toMillis(),
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
