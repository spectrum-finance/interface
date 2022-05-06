import { publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const networkAssetBalance$ = selectedNetwork$.pipe(
  switchMap((network) => network.networkAssetBalance$),
  publishReplay(1),
  refCount(),
);
