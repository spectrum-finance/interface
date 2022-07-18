import { map, publishReplay, refCount } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const operationsSettings$ = selectedNetwork$.pipe(
  map((n) => n.OperationsSettings),
  publishReplay(),
  refCount(),
);
