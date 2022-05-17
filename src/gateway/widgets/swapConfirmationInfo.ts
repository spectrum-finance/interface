import { map, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const swapConfirmationInfo$ = selectedNetwork$.pipe(
  map((n) => n.SwapConfirmationInfo),
  publishReplay(),
  refCount(),
);
