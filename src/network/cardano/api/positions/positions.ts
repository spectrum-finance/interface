import {
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { Position } from '../../../../common/models/Position';
import {
  allAmmPools$,
  showUnverifiedPools$,
  unverifiedAmmPools$,
} from '../ammPools/ammPools';
import { lpBalance$ } from '../balance/lpBalance';
import { networkAssetBalance$ } from '../balance/networkAssetBalance.ts';
import { networkContext$ } from '../networkContext/networkContext';

export const positions$ = combineLatest([
  showUnverifiedPools$.pipe(
    switchMap((showUnverifiedPools) => {
      if (showUnverifiedPools) {
        return unverifiedAmmPools$;
      }
      return allAmmPools$;
    }),
  ),
  networkAssetBalance$.pipe(
    filter(Boolean),
    first(),
    switchMap(() => lpBalance$.pipe(startWith(new Balance([])))),
  ),
  networkContext$,
]).pipe(
  debounceTime(200),
  map(([ammPools, lpWalletBalance, networkContext]) =>
    ammPools
      .filter((ap) => lpWalletBalance.get(ap.lp.asset).isPositive())
      .map(
        (ap) =>
          new Position(
            ap,
            lpWalletBalance.get(ap.lp.asset),
            false,
            [],
            networkContext.height,
            [],
          ),
      ),
  ),
  publishReplay(1),
  refCount(),
);
