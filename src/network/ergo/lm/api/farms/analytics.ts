import axios from 'axios';
import { catchError, map, of, publishReplay, refCount, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { networkContext$ } from '../../../api/networkContext/networkContext';

export interface CommonFarmAnalyticsItem {
  readonly poolId: string;
  readonly compoundedReward: number;
  readonly yearProfit: number;
}

export const commonFarmsAnalytics$ = networkContext$.pipe(
  switchMap(() =>
    axios.get<CommonFarmAnalyticsItem[]>(
      `${applicationConfig.networksSettings.ergo.analyticUrl}lm/pools/stats`,
    ),
  ),
  map((res) => res.data),
  catchError(() => of([])),
  publishReplay(1),
  refCount(),
);
