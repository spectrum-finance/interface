import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { Position } from '../../../common/models/Position';
import { lpWalletBalance$ } from '../../../services/new/balance';
import { availablePools$ } from '../../../services/new/pools';

export const positions$ = combineLatest([
  availablePools$,
  lpWalletBalance$,
]).pipe(
  map(([pools, lpWalletBalance]) =>
    pools.map((p) => new Position(p, lpWalletBalance.get(p.lp.asset))),
  ),
  publishReplay(1),
  refCount(),
);
