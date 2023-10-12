import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Balance } from '../../../../common/models/Balance';
import {
  allAmmPools$,
  showUnverifiedPools$,
  unverifiedAmmPools$,
} from '../ammPools/ammPools';
import { balanceItems$ } from './balance';

export const lpBalance$: Observable<Balance> = combineLatest([
  balanceItems$,
  showUnverifiedPools$.pipe(
    switchMap((showUnverifiedPools) => {
      if (showUnverifiedPools) {
        return unverifiedAmmPools$;
      }
      return allAmmPools$;
    }),
  ),
]).pipe(
  map(([balanceItems, pools]) =>
    balanceItems.filter(([, info]) =>
      pools.some((p) => p.lp.asset.id === info.id),
    ),
  ),
  distinctUntilChanged(
    (prev: [bigint, AssetInfo][], next: [bigint, AssetInfo][]) => {
      if (prev?.length !== next?.length) {
        return false;
      }
      return prev?.every(
        ([amount, asset]) =>
          amount === next.find((item) => item[1].id === asset.id)?.[0],
      );
    },
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
