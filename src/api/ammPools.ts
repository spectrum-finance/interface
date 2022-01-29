import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';

export const ammPools$ = selectedNetwork$.pipe(
  switchMap((network) => network.ammPools$),
  publishReplay(1),
  refCount(),
);
