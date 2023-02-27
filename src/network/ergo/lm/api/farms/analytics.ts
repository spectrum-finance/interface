import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';
import axios from 'axios';
import { catchError, map, of, publishReplay, refCount, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { getAddresses } from '../../../api/addresses/addresses';
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

export interface UserFarmAnalyticsCompoundResult {
  readonly poolId: string;
  readonly reward: TokenAmount;
}

export interface UserFarmAnalyticsNextStakeReward {
  readonly poolId: string;
  readonly nextReward: bigint;
}

export interface UserFarmAnalytics {
  readonly userInterests: UserFarmAnalyticsCompoundResult[];
  readonly userNextStakesReward: UserFarmAnalyticsNextStakeReward[];
}

export const userFarmsAnalytics$ = networkContext$.pipe(
  switchMap(() => getAddresses()),
  switchMap((addresses) =>
    axios.post<UserFarmAnalytics>(
      `${applicationConfig.networksSettings.ergo.analyticUrl}lm/user/stats`,
      addresses,
    ),
  ),
  map((res) => res.data),
  catchError(() => of({ userInterests: [], userNextStakesReward: [] })),
  publishReplay(1),
  refCount(),
);
