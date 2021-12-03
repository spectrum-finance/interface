import {
  AmmPool,
  makeNativePools,
  makePools,
  NetworkPools,
  PoolId,
} from '@ergolabs/ergo-dex-sdk';
import { ErgoBox } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  defer,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  zip,
} from 'rxjs';

import { selectedNetwork$ } from './network';

export const availablePools$ = selectedNetwork$.pipe(
  switchMap((n) => n.availablePools$),
  publishReplay(1),
  refCount(),
);

export const getPoolById = (poolId: PoolId) =>
  selectedNetwork$.pipe(switchMap((n) => n.getPoolById(poolId)));

export const getPoolByPair = (
  xId: string,
  yId: string,
): Observable<AmmPool[]> =>
  selectedNetwork$.pipe(switchMap((n) => n.getPoolByPair(xId, yId)));

export const pools$ = selectedNetwork$.pipe(
  switchMap((n) => n.pools$),
  publishReplay(1),
  refCount(),
);
