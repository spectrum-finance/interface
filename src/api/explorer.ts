import {
  from,
  interval,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { explorer } from '../services/explorer';

const UPDATE_TIME = 1000 * 10;

export const ergoExplorerContext$ = interval(UPDATE_TIME).pipe(
  startWith(undefined),
  switchMap(() => from(explorer.getNetworkContext())),
  map((ctx) => ctx),
  publishReplay(1),
  refCount(),
);
