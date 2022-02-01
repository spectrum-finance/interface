import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
} from 'rxjs';

import { Position } from '../../../common/models/Position';
import { lpWalletBalance$ } from '../../../services/new/balance';
import { ammPools$ } from '../ammPools/ammPools';
import { tokenLocksGroupedByLpAsset$ } from '../common/tokenLocks';
import { networkContext$ } from '../networkContext/networkContext';

export const positions$ = combineLatest([
  ammPools$,
  lpWalletBalance$,
  tokenLocksGroupedByLpAsset$,
  networkContext$,
]).pipe(
  debounceTime(200),
  map(
    ([ammPools, lpWalletBalance, tokenLocksGroupedByLpAsset, networkContext]) =>
      ammPools
        .filter((ap) => lpWalletBalance.get(ap.lp.asset).isPositive())
        .map(
          (ap) =>
            new Position(
              ap,
              lpWalletBalance.get(ap.lp.asset),
              false,
              tokenLocksGroupedByLpAsset[ap.lp.asset.id],
              networkContext.height,
            ),
        ),
  ),
  publishReplay(1),
  refCount(),
);
