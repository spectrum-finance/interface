import { map, publishReplay, refCount, zip } from 'rxjs';

import { Position } from '../../../common/models/Position';
import { ammPools$ } from '../ammPools/ammPools';
import { lpBalance$ } from '../balance/lpBalance';
import { tokenLocksGroupedByLpAsset$ } from '../common/tokenLocks';
import { networkContext$ } from '../networkContext/networkContext';

export const positions$ = zip([
  ammPools$,
  lpBalance$,
  tokenLocksGroupedByLpAsset$,
  networkContext$,
]).pipe(
  map(
    ([ammPools, lpWalletBalance, tokenLocksGroupedByLpAsset, networkContext]) =>
      ammPools
        .filter(
          (ap) =>
            lpWalletBalance.get(ap.lp.asset).isPositive() ||
            tokenLocksGroupedByLpAsset[ap.lp.asset.id]?.length > 0,
        )
        .map(
          (ap) =>
            new Position(
              ap,
              lpWalletBalance.get(ap.lp.asset),
              false,
              ap.verified,
              tokenLocksGroupedByLpAsset[ap.lp.asset.id] || [],
              networkContext.height,
            ),
        ),
  ),
  publishReplay(1),
  refCount(),
);
