import {
  distinctUntilKeyChanged,
  from,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  timer,
} from 'rxjs';

import { appTick$ } from '../../../../common/streams/appTick';
import { explorer } from '../../../../services/explorer';

//@ts-ignore
export const networkContext$: Observable<{
  readonly height: number;
  readonly lastBlockId: number;
}> = appTick$.pipe(
  switchMap(() => from(explorer.getNetworkContext())),
  map((ctx) => ctx),
  distinctUntilKeyChanged('height'),
  switchMap((ctx, i) => (i === 0 ? of(ctx) : timer(2000).pipe(mapTo(ctx)))),
  publishReplay(1),
  refCount(),
);
