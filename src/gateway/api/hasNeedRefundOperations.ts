import { Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const hasNeedRefundOperations$: Observable<boolean> =
  selectedNetwork$.pipe(
    switchMap((n) => n.hasNeedRefundOperations$),
    publishReplay(1),
    refCount(),
  );
