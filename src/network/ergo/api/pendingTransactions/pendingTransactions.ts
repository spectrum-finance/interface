import {
  combineLatest,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { appTick$ } from '../../../../common/streams/appTick';
import { uint } from '../../../../common/types';
import networkHistory from '../../../../services/networkHistory';
import { getAddresses } from '../addresses/addresses';
import {
  operationsInProgress$,
  operationsInQueue$,
} from '../operations/common/submitTx';

// export const pendingTransactions$ = combineLatest([
//   getAddresses(),
//   appTick$,
// ]).pipe(
//   switchMap(([addresses]) =>
//     combineLatest(
//       addresses.map((addr) =>
//         from(
//           networkHistory.network.getUTxsByAddress(addr, {
//             limit: 20,
//             offset: 0,
//           }),
//         ).pipe(
//           map(([txs]) =>
//             txs.map((tx) => networkHistory['parseOp'](tx, false, [addr])),
//           ),
//         ),
//       ),
//     ),
//   ),
//   map((txsByAddress) => txsByAddress.flatMap((txs) => txs).filter(Boolean)),
//   publishReplay(1),
//   refCount(),
// );

export const pendingTransactions$: Observable<uint> = combineLatest([
  operationsInProgress$,
  operationsInQueue$,
]).pipe(
  tap(console.log, console.log),
  map(
    ([operationsInProgress, operationsInQueue]) =>
      operationsInProgress.length + operationsInQueue.length,
  ),
  publishReplay(1),
  refCount(),
);
