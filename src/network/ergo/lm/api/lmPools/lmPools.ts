import { LmPool as BaseLmPool } from '@ergolabs/ergo-dex-sdk';
import {
  combineLatest,
  defaultIfEmpty,
  map,
  Observable,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { AmmPool } from '../../../../../common/models/AmmPool';
import { Balance } from '../../../../../common/models/Balance';
import { LmPool } from '../../../../../common/models/LmPool';
import { ammPools$ } from '../../../api/ammPools/ammPools';
import { lpBalance$ } from '../../../api/balance/lpBalance';
import { mapToAssetInfo } from '../../../api/common/assetInfoManager';
import { rawLmPools$ } from '../../../api/common/rawLmPools';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { ErgoLmPool, ErgoLmPoolParams } from '../../models/ErgoLmPool';
import {
  rawStakesWithRedeemerKey$,
  RawStakeWithRedeemerKey,
} from '../stakes/stakes';

const toLmPool = (params: ErgoLmPoolParams): Observable<LmPool> =>
  combineLatest(
    [
      params.lmPool.lq.asset,
      params.lmPool.tt.asset,
      params.lmPool.vlq.asset,
      params.lmPool.budget.asset,
    ].map((asset) => {
      return mapToAssetInfo(asset.id);
    }),
  ).pipe(
    map(([lq, tt, vlq, reward]) => {
      return new ErgoLmPool(params, {
        lq: lq || params.lmPool.lq.asset,
        vlq: vlq || params.lmPool.vlq.asset,
        tt: tt || params.lmPool.tt.asset,
        reward: reward || params.lmPool.budget.asset,
      });
    }),
  );

const toLmPoolStreams = (
  rawLmPools: BaseLmPool[],
  ammPools: AmmPool[],
  stakes: RawStakeWithRedeemerKey[],
  lpBalance: Balance,
  currentHeight: number,
): Observable<LmPool>[] =>
  rawLmPools.reduce<Observable<LmPool>[]>((acc, rawLmPool) => {
    const ammPoolByLq = ammPools.find(
      (ammPool) => ammPool.lp.asset.id === rawLmPool.lq.asset.id,
    );

    if (ammPoolByLq) {
      acc.push(
        toLmPool({
          lmPool: rawLmPool,
          ammPool: ammPoolByLq,
          currentHeight,
          balanceLq: lpBalance.get(rawLmPool.lq.asset),
          stakes: stakes.filter((s) => s.poolId === rawLmPool.id),
        }),
      );
    }
    return acc;
  }, []);

export const allLmPools$ = combineLatest([
  rawLmPools$,
  ammPools$,
  rawStakesWithRedeemerKey$,
  lpBalance$.pipe(startWith(new Balance([]))),
  networkContext$,
]).pipe(
  switchMap(([rawLmPools, ammPools, stakes, lpBalance, networkContext]) =>
    combineLatest(
      toLmPoolStreams(
        rawLmPools,
        ammPools,
        stakes,
        lpBalance,
        networkContext.height,
      ),
    ).pipe(defaultIfEmpty([])),
  ),
  publishReplay(1),
  refCount(),
);

export const farmPools$ = allLmPools$.pipe(
  map((lmPools) =>
    lmPools.filter(
      (lmPool) => !applicationConfig.blacklistedPools.includes(lmPool.id),
    ),
  ),
  publishReplay(1),
  refCount(),
);
