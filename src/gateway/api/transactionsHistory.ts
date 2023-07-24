import { first, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { OperationItem } from '../../common/models/OperationV2';
import { selectedNetwork$ } from '../common/network';

export const getOperations = (
  limit: number,
  offset: number,
): Observable<[OperationItem[], number]> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.getOperations(limit, offset)),
    publishReplay(),
    refCount(),
  );

export const getOperationByTxId = (
  txId: string,
): Observable<OperationItem | undefined> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((network) => network.getOperationByTxId(txId)),
  );
