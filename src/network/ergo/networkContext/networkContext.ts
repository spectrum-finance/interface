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

const TICK_TIME = 10 * 1000;

export const networkContext$: Observable<{ height: number }> = interval(
  TICK_TIME,
).pipe(
  startWith(undefined),
  switchMap(() => from(explorer.getNetworkContext())),
  map((ctx) => ctx),
  publishReplay(1),
  refCount(),
);
