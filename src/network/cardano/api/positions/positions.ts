import { DateTime } from 'luxon';
import {
  combineLatest,
  debounceTime,
  defaultIfEmpty,
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
import { getTokenLocksByPoolId } from '../common/tokenLocks.ts';
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
  networkContext$,
]).pipe(
  debounceTime(200),
  switchMap(([ammPools, lpWalletBalance, networkContext]) =>
    combineLatest(
      ammPools
        .filter((ap) => lpWalletBalance.get(ap.lp.asset).isPositive())
        .map((ap) =>
          getTokenLocksByPoolId(ap.id).pipe(
            map((locks) => {
              return new Position(
                ap,
                lpWalletBalance.get(ap.lp.asset),
                false,
                locks.map((l) => ({
                  redeemer: l.redeemer,
                  active: true,
                  boxId: l.entityId,
                  deadline: 0,
                  unlockDate: DateTime.fromMillis(l.deadline),
                  lockedAsset: new Currency(BigInt(l.amount), ap.lp.asset),
                  currentBlock: networkContext.height,
                })),
                [],
              );
            }),
          ),
        ),
    ).pipe(defaultIfEmpty([])),
  ),
  publishReplay(1),
  refCount(),
);
