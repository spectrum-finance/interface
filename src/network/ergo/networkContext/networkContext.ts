import {
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
  height: number;
  lastBlockId: number;
}> = appTick$.pipe(
  switchMap(() => from(explorer.getNetworkContext())),
  map((ctx) => ctx),
  publishReplay(1),
  refCount(),
);
