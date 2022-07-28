import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const queuedOperation$ = selectedNetwork$.pipe(
  switchMap((n) => n.queuedOperation$),
  publishReplay(1),
  refCount(),
);
