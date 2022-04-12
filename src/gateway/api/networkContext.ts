import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const networkContext$ = selectedNetwork$.pipe(
  switchMap((n) => n.networkContext$),
  publishReplay(1),
  refCount(),
);
