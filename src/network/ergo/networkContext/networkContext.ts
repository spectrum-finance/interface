import {
  distinctUntilKeyChanged,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { explorer } from '../../../services/explorer';

//@ts-ignore
export const networkContext$: Observable<{
  readonly height: number;
  readonly lastBlockId: number;
}> = appTick$.pipe(
  switchMap(() => from(explorer.getNetworkContext())),
  map((ctx) => ctx),
  distinctUntilKeyChanged('height'),
  publishReplay(1),
  refCount(),
);
