import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { appTick$ } from '../../../../common/streams/appTick';
import { cardanoNetwork } from '../common/cardanoNetwork';

export const networkContext$: Observable<{
  readonly height: number;
  readonly lastBlockId: number;
  readonly blockHash: string;
  readonly slotNo: bigint;
}> = appTick$.pipe(
  switchMap(() => from(cardanoNetwork.getNetworkContext())),
  map((ctx) => ({
    height: Number(ctx.blockNo),
    lastBlockId: Number(ctx.blockNo),
    blockHash: (ctx as any).blockHash,
    slotNo: BigInt((ctx as any).slotNo),
  })),
  // distinctUntilKeyChanged('height'),
  publishReplay(1),
  refCount(),
);
