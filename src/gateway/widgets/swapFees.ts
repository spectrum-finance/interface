import { map, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const swapFees$ = selectedNetwork$.pipe(
  map((n) => n.SwapFees),
  publishReplay(),
  refCount(),
);
