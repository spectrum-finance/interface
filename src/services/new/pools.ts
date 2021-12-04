import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { of, publishReplay, refCount, switchMap } from 'rxjs';

import { getPoolByPair as cardanoGetPoolByPair } from '../../networks/cardano/cardano';
import { getPoolByPair as ergoGetPoolByPair } from '../../networks/ergo/ergo';
import { _selectedNetwork$, selectedNetwork$ } from './network';

export const availablePools$ = selectedNetwork$.pipe(
  switchMap((n) => n.availablePools$),
  publishReplay(1),
  refCount(),
);

export const getPoolById = (poolId: PoolId) =>
  selectedNetwork$.pipe(switchMap((n) => n.getPoolById(poolId)));

export const getPoolByPair = (xId: string, yId: string) =>
  _selectedNetwork$.getValue().name === 'ergo'
    ? ergoGetPoolByPair(xId, yId)
    : cardanoGetPoolByPair(xId, yId);

// export const getPoolByPair = (
//   xId: string,
//   yId: string,
// ): Observable<AmmPool[]> => {
//   console.log('call');
//
//   return selectedNetwork$.pipe(
//     tap(console.log),
//     first(),
//     switchMap((n) => n.getPoolByPair(xId, yId)),
//     tap(console.log),
//   );
// };

export const pools$ = selectedNetwork$.pipe(
  switchMap((n) => n.pools$),
  publishReplay(1),
  refCount(),
);
