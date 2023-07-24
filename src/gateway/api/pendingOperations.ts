import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const pendingOperationsCount$ = selectedNetwork$.pipe(
  switchMap((n) => n.pendingOperationsCount$),
  publishReplay(1),
  refCount(),
);
