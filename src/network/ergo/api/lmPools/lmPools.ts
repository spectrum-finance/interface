import { LmPool as BaseLmPool } from '@ergolabs/ergo-dex-sdk';
import { Stake } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/stake';
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

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Balance } from '../../../../common/models/Balance';
import { Currency } from '../../../../common/models/Currency';
import { LmPool } from '../../../../common/models/LmPool';
import { ammPools$ } from '../ammPools/ammPools';
import { assetBalance$ } from '../balance/assetBalance';
import { lpBalance$ } from '../balance/lpBalance';
import { mapToAssetInfo } from '../common/assetInfoManager';
import { rawLmPools$ } from '../common/rawLmPools';
import { stakes$ } from '../lmStake/lmStake';
import { networkContext$ } from '../networkContext/networkContext';
import { ErgoLmPool } from './ErgoLmPool';

const toLmPool = (
  p: BaseLmPool,
  ammPool: AmmPool,
  {
    balanceLq,
    stakes,
    currentHeight,
  }: { balanceLq: Currency; stakes: Stake[]; currentHeight: number },
): Observable<LmPool> =>
  combineLatest(
    [
      p.lq.asset,
      p.tt.asset,
      p.vlq.asset,
      p.budget.asset,
      ammPool.x.asset,
      ammPool.y.asset,
    ].map((asset) => {
      return mapToAssetInfo(asset.id);
    }),
  ).pipe(
    map(([lq, tt, vlq, reward]) => {
      return new ErgoLmPool(p, {
        lq: lq || p.lq.asset,
        vlq: vlq || p.vlq.asset,
        tt: tt || p.tt.asset,
        reward: reward || p.budget.asset,
        ammPool,
        balanceLq,
        stakes,
        currentHeight,
      });
    }),
  );

export const allLmPools$ = combineLatest([
  rawLmPools$,
  ammPools$,
  stakes$,
  lpBalance$.pipe(startWith(new Balance([]))),
  networkContext$,
]).pipe(
  switchMap(([rawLmPools, ammPools, stakes, lpBalance, networkContext]) =>
    combineLatest(
      rawLmPools.reduce((acc, rlp) => {
        const ammPoolByLp = ammPools.find(
          (amm) => amm.lp.asset.id === rlp.lq.asset.id,
        );
        if (ammPoolByLp) {
          acc.push(
            toLmPool(rlp, ammPoolByLp, {
              stakes: stakes.filter((s) => s.poolId === rlp.id),
              balanceLq: lpBalance.get(rlp.lq.asset),
              currentHeight: networkContext.height,
            }),
          );
        }

        return acc;
      }, [] as Observable<LmPool>[]),
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
