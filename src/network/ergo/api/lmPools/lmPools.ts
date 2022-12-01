import { LmPool as BaseLmPool } from '@ergolabs/ergo-dex-sdk';
import {
  combineLatest,
  defaultIfEmpty,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import { LmPool } from '../../../../common/models/LmPool';
import { displayedAmmPools$ } from '../ammPools/ammPools';
import { mapToAssetInfo } from '../common/assetInfoManager';
import { rawLmPools$ } from '../common/rawLmPools';
import { ErgoLmPool } from './ErgoLmPool';

const toLmPool = (p: BaseLmPool, ammPool: AmmPool): Observable<LmPool> =>
  combineLatest(
    [
      p.lq.asset,
      p.tt.asset,
      p.vlq.asset,
      p.reward.asset,
      ammPool.x.asset,
      ammPool.y.asset,
    ].map((asset) => {
      return mapToAssetInfo(asset.id);
    }),
  ).pipe(
    map(([lq, tt, vlq, reward, assetX, assetY]) => {
      return new ErgoLmPool(p, {
        lq: lq || p.lq.asset,
        vlq: vlq || p.vlq.asset,
        tt: tt || p.tt.asset,
        reward: reward || p.reward.asset,
        assetX: assetX || ammPool.x.asset,
        assetY: assetY || ammPool.y.asset,
      });
    }),
  );

export const allLmPools$ = combineLatest([
  rawLmPools$,
  displayedAmmPools$,
]).pipe(
  switchMap(([rawLmPools, displayedAmmPools]) =>
    combineLatest(
      rawLmPools.reduce((acc, rlp) => {
        const ammPoolByLp = displayedAmmPools.find(
          (amm) => amm.lp.asset.id === rlp.lq.asset.id,
        );

        if (ammPoolByLp) {
          acc.push(toLmPool(rlp, ammPoolByLp));
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
