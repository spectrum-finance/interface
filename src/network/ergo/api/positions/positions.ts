import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Farm } from '../../../../common/models/Farm';
import { Position } from '../../../../common/models/Position';
import { getFarmsByPoolId } from '../../lm/api/farms/farms';
import { allAmmPools$ } from '../ammPools/ammPools';
import { lpBalance$ } from '../balance/lpBalance';
import { tokenLocksGroupedByLpAsset$ } from '../common/tokenLocks';
import { networkContext$ } from '../networkContext/networkContext';

export const positions$ = combineLatest([
  allAmmPools$,
  lpBalance$,
  tokenLocksGroupedByLpAsset$,
  networkContext$,
]).pipe(
  debounceTime(200),
  switchMap(
    ([ammPools, lpWalletBalance, tokenLocksGroupedByLpAsset, networkContext]) =>
      combineLatest(
        ammPools.map((ammPool) =>
          getFarmsByPoolId(ammPool.id).pipe(
            map((farms) => ({
              ammPool,
              farms,
            })),
          ),
        ),
      ).pipe(
        map((ammPoolsWithFarms: { ammPool: AmmPool; farms: Farm[] }[]) =>
          ammPoolsWithFarms
            .filter(
              ({ ammPool, farms }) =>
                lpWalletBalance.get(ammPool.lp.asset).isPositive() ||
                tokenLocksGroupedByLpAsset[ammPool.lp.asset.id]?.length > 0 ||
                farms.some((f) => f.yourStakeLq.isPositive()),
            )
            .map(
              ({ ammPool, farms }) =>
                new Position(
                  ammPool,
                  lpWalletBalance.get(ammPool.lp.asset),
                  false,
                  tokenLocksGroupedByLpAsset[ammPool.lp.asset.id] || [],
                  networkContext.height,
                  farms,
                ),
            ),
        ),
      ),
  ),
  publishReplay(1),
  refCount(),
);
