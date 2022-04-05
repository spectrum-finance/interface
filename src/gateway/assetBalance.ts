import { publishReplay, refCount, switchMap } from 'rxjs';

import { useObservable } from '../common/hooks/useObservable';
import { Balance } from '../common/models/Balance';
import { selectedNetwork$ } from './network';

export const assetBalance$ = selectedNetwork$.pipe(
  switchMap((network) => network.assetBalance$),
  publishReplay(1),
  refCount(),
);

export const useAssetsBalance = (): [Balance, boolean, Error] =>
  useObservable(assetBalance$, [], new Balance([]));
