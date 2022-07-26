import {
  combineLatest,
  map,
  Observable,
  publishReplay,
  refCount,
  tap,
} from 'rxjs';

import { uint } from '../../../../common/types';
import {
  operationsInProgress$,
  operationsInQueue$,
} from '../operations/common/submitTx';

export const pendingTransactions$: Observable<uint> = combineLatest([
  operationsInProgress$,
  operationsInQueue$,
]).pipe(
  tap(console.log, console.log),
  map(
    ([operationsInProgress, operationsInQueue]) =>
      operationsInProgress.length + operationsInQueue.length,
  ),
  publishReplay(1),
  refCount(),
);
