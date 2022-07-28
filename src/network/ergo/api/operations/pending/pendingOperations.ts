import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { inProgressOperations$ } from './inProgressOperations';
import { queuedOperation$ } from './queuedOperation';

export const pendingOperations$ = combineLatest([
  queuedOperation$,
  inProgressOperations$,
]).pipe(
  map(([queuedOperation, inProgressOperations]) =>
    queuedOperation
      ? [queuedOperation, ...inProgressOperations]
      : inProgressOperations,
  ),
  publishReplay(1),
  refCount(),
);
