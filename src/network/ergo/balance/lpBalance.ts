import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
} from 'rxjs';

import { Balance } from '../../../common/models/Balance';
import { ammPools$ } from '../ammPools/ammPools';
import { availableTokensData$ } from './common';

export const lpBalance$ = combineLatest([ammPools$, availableTokensData$]).pipe(
  debounceTime(200),
  map(([pools, availableTokensData]) =>
    availableTokensData.filter(([, info]) =>
      pools.some((p) => p.lp.asset.id === info.id),
    ),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
