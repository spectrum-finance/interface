import { map, publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const swapConfirmationModal$ = selectedNetwork$.pipe(
  switchMap((selectedNetwork) => selectedNetwork.swapConfirmationModal$),
  publishReplay(1),
  refCount(),
);
