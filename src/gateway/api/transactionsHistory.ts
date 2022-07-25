import {
  first,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Operation } from '../../common/models/Operation';
import { selectedNetwork$ } from '../common/network';

export const getOperations = (): Observable<Operation[]> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.getOperations()),
    publishReplay(),
    refCount(),
  );

export const getOperationByTxId = (
  txId: string,
): Observable<Operation | undefined> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((network) => network.getOperationByTxId(txId)),
  );

export const getSyncOperationsFunction = (): Observable<
  (() => void) | undefined
> =>
  selectedNetwork$.pipe(
    first(),
    map((n) => n.syncOperations),
    publishReplay(1),
    refCount(),
  );

export const isOperationsSyncing$ = selectedNetwork$.pipe(
  switchMap((n) => n.isOperationsSyncing$),
  publishReplay(1),
  refCount(),
);
