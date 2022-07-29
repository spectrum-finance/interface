import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const pendingOperations$ = selectedNetwork$.pipe(
  switchMap((n) => n.pendingOperations$),
  publishReplay(1),
  refCount(),
);
