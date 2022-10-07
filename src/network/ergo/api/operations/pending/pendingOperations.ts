import uniqBy from 'lodash/uniqBy';
import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { operationsHistory$ } from '../history/transactionHistory';
import { inProgressOperations$ } from './inProgressOperations';
import { queuedOperation$ } from './queuedOperation';

export const pendingOperations$ = combineLatest([
  queuedOperation$,
  inProgressOperations$,
  operationsHistory$,
]).pipe(
  map(([queuedOperation, inProgressOperations, operationsHistory]) => {
    const filteredInProgressOperations = inProgressOperations.filter(
      (po) =>
        !operationsHistory.some(
          (o) => po.id === o.id || po.orderInput?.outputTransactionId === o.id,
        ),
    );

    return queuedOperation
      ? [queuedOperation, ...filteredInProgressOperations]
      : filteredInProgressOperations;
  }),
  map((pendingOperations) => uniqBy(pendingOperations, 'id')),
  publishReplay(1),
  refCount(),
);
