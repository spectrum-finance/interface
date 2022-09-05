import { map, publishReplay, refCount, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { displayedAmmPools$ } from '../ammPools/ammPools';
import { availableTokensData$ } from './common';

export const lpBalance$ = zip([displayedAmmPools$, availableTokensData$]).pipe(
  map(([pools, availableTokensData]) =>
    availableTokensData.filter(([, info]) =>
      pools.some((p) => p.lp.asset.id === info.id),
    ),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
