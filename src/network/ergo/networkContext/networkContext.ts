import {
  from,
  interval,
  map,
  Observable,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { explorer } from '../../../services/explorer';

export const networkContext$: Observable<{ height: number }> = interval(
  10 * 1000,
).pipe(
  startWith(undefined),
  switchMap(() => from(explorer.getNetworkContext())),
  map((ctx) => ctx),
  publishReplay(1),
  refCount(),
);
