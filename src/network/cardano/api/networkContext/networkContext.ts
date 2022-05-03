import {
  distinctUntilKeyChanged,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { appTick$ } from '../../../../common/streams/appTick';
import { cardanoNetwork } from '../common/cardanoNetwork';

export const networkContext$: Observable<{
  readonly height: number;
  readonly lastBlockId: number;
}> = appTick$.pipe(
  switchMap(() => from(cardanoNetwork.getNetworkContext())),
  map((ctx) => ({
    height: Number(ctx.blockNo),
    lastBlockId: Number(ctx.blockNo),
  })),
  distinctUntilKeyChanged('height'),
  publishReplay(1),
  refCount(),
);
