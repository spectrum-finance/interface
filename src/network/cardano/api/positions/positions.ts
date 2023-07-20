import { map, publishReplay, refCount, startWith, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { Position } from '../../../../common/models/Position';
import { ammPools$ } from '../ammPools/ammPools';
import { lpBalance$ } from '../balance/lpBalance';
import { networkContext$ } from '../networkContext/networkContext';

export const positions$ = zip([
  ammPools$,
  lpBalance$.pipe(startWith(new Balance([]))),
  networkContext$,
]).pipe(
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
