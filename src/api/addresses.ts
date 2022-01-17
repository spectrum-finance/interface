import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';

export const addresses$ = selectedNetwork$.pipe(
  switchMap((network) => network.addresses$),
  publishReplay(1),
  refCount(),
);
