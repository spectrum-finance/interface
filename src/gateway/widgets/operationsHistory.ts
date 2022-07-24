import { map, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const operationsHistory$ = selectedNetwork$.pipe(
  map((n) => n.OperationsHistory),
  publishReplay(1),
  refCount(),
);
