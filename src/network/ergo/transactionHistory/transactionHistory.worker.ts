import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { Address, AugErgoTx, RustModule } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  from,
  map,
  mapTo,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { Dictionary } from '../../../common/utils/Dictionary';
import networkHistory from '../../../services/networkHistory';
import { WorkerBatchMessage } from './workerMessages/workerBatchMessage';
import { WorkerStartMessage } from './workerMessages/workerStartMessage';
import { WorkerSyncEndMessage } from './workerMessages/workerSyncEndMessage';

const TX_LIMIT = 150;
const ctx = self as any;

let oldHandledTxs: Dictionary<Dictionary<boolean>>;
let oldOperations: Dictionary<AmmDexOperation[]>;

const parseOperation = (
  tx: AugErgoTx,
  address: Address,
): AmmDexOperation | undefined => {
  if (oldHandledTxs[address] && oldHandledTxs[address][tx.id]) {
    return oldOperations[address]?.find((op) => op.txId === tx.id);
  }

  return networkHistory['parseOp'](tx, true, [address]);
};

const toHandledTxsDictionary = (txs: AugErgoTx[]): Dictionary<boolean> =>
  txs.reduce<Dictionary<boolean>>(
    (dictionary, tx) => ({ ...dictionary, [tx.id]: true }),
    {},
  );

const sendSyncEndMessage = (success: boolean): void => {
  const msg: WorkerSyncEndMessage = {
    message: 'syncEnd',
    payload: {
      success,
    },
  };

  ctx.postMessage(msg);
};

const sendBatchMessage = (txs: AugErgoTx[], address: string): void => {
  const msg: WorkerBatchMessage = {
    message: 'batch',
    payload: {
      address,
      handledTxs: toHandledTxsDictionary(txs),
      operations: txs
        .map((tx) => parseOperation(tx, address))
        .filter(Boolean) as AmmDexOperation[],
    },
  };

  ctx.postMessage(msg);
};

const getTxsByAddress = (
  address: string,
  limit = TX_LIMIT,
  offset = 0,
): Observable<number> => {
  return from(
    networkHistory.network.getTxsByAddress(address, {
      offset,
      limit: TX_LIMIT,
    }),
  ).pipe(
    tap(([txs]) => sendBatchMessage(txs, address)),
    switchMap(([txs, totalTxsCount]) => {
      const newOffset = offset + limit;

      if (totalTxsCount < newOffset) {
        return of(txs.length);
      }
      return getTxsByAddress(address, limit, newOffset).pipe(
        map((additionalTxsLength) => additionalTxsLength + txs.length),
      );
    }),
  );
};

const updateAddresses$ = new Subject<string[]>();

updateAddresses$
  .pipe(
    switchMap((addresses) => from(RustModule.load()).pipe(mapTo(addresses))),
    switchMap((addresses) =>
      combineLatest(addresses.map((a) => getTxsByAddress(a, TX_LIMIT))),
    ),
  )
  .subscribe({
    next: () => sendSyncEndMessage(true),
    error: () => sendSyncEndMessage(false),
  });

ctx.addEventListener('message', (msg: MessageEvent<WorkerStartMessage>) => {
  oldHandledTxs = msg.data.payload.oldHandledTxs || {};
  oldOperations = msg.data.payload.oldOperations || {};
  updateAddresses$.next(msg.data.payload.addresses);
});
