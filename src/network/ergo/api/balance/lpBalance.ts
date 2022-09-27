import { map, publishReplay, refCount, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { allAmmPools$ } from '../ammPools/ammPools';
import { balanceItems$ } from './common';

export const lpBalance$ = zip([allAmmPools$, balanceItems$]).pipe(
  map(([pools, balanceItems]) =>
    balanceItems.filter(([, info]) =>
      pools.some((p) => p.lp.asset.id === info.id),
    ),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
