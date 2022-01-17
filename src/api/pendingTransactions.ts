import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';

export const pendingTransactionsCount$ = selectedNetwork$.pipe(
  switchMap((network) => network.pendingTransactionsCount$),
  publishReplay(1),
  refCount(),
);
