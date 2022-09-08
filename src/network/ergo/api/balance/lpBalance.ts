import { map, publishReplay, refCount, zip } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { allAmmPools$ } from '../ammPools/ammPools';
import { availableTokensData$ } from './common';

export const lpBalance$ = zip([allAmmPools$, availableTokensData$]).pipe(
  map(([pools, availableTokensData]) =>
    availableTokensData.filter(([, info]) =>
      pools.some((p) => p.lp.asset.id === info.id),
    ),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
