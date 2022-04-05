import { map, publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from './network';

export const locks$ = selectedNetwork$.pipe(
  switchMap((network) => network.locks$),
  map((locks) => locks.filter((l) => l.active)),
  publishReplay(1),
  refCount(),
);
