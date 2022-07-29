import {
  combineLatest,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Operation } from '../../../../common/models/Operation';
import networkHistory from '../../../../services/networkHistory';
import { mapToOperationOrEmpty } from './common/mapToOperationOrEmpty';
import { toDexOperation } from './common/toDexOperation';
import { operationsHistory$ } from './history/transactionHistory';
import { pendingOperations$ } from './pending/pendingOperations';

export const getOperations = (): Observable<Operation[]> =>
  combineLatest([operationsHistory$, pendingOperations$]).pipe(
    map(([operationsHistory, pendingOperations]) => [
      ...pendingOperations,
      ...operationsHistory,
    ]),
    publishReplay(1),
    refCount(),
  );

export const getOperationByTxId = (
  txId: string,
): Observable<Operation | undefined> =>
  from(networkHistory.network.getTx(txId)).pipe(
    switchMap(toDexOperation),
    switchMap((dexOperation) =>
      dexOperation ? mapToOperationOrEmpty(dexOperation) : of(undefined),
    ),
  );
