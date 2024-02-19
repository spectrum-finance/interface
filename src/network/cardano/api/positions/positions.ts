import { DateTime } from 'luxon';
import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { Currency } from '../../../../common/models/Currency.ts';
import { Position } from '../../../../common/models/Position';
import {
  allAmmPools$,
  showUnverifiedPools$,
  unverifiedAmmPools$,
} from '../ammPools/ammPools';
import { lpBalance$ } from '../balance/lpBalance';
import { locks$ } from '../common/tokenLocks.ts';
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
  lpBalance$.pipe(startWith(new Balance([]))),
  locks$,
  networkContext$,
]).pipe(
  debounceTime(200),
  map(([ammPools, lpWalletBalance, locks, networkContext]) =>
    ammPools
      .filter((ap) => lpWalletBalance.get(ap.lp.asset).isPositive())
      .map(
        (ap) =>
          new Position(
            ap,
            lpWalletBalance.get(ap.lp.asset),
            false,
            locks[ap.id]?.map((l) => ({
              redeemer: l.redeemer,
              active: true,
              boxId: l.entityId,
              deadline: 0,
              unlockDate: DateTime.fromMillis(l.deadline),
              lockedAsset: new Currency(BigInt(l.amount), ap.lp.asset),
              currentBlock: networkContext.height,
            })) || [],
            [],
          ),
      ),
  ),
  publishReplay(1),
  refCount(),
);
