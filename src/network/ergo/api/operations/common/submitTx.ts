import { BoxId, ErgoTx } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  first,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { OperationStatus } from '../../../../../common/models/Operation';
import {
  TxSuccess,
  TxSuccessStatus,
} from '../../../../../common/services/submitTx';
import { uint } from '../../../../../common/types';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { networkContext$ } from '../../networkContext/networkContext';
import { AdditionalParams, mapErgoTxToOperation } from './mapErgoTxOperation';

const TX_QUEUE_KEY = 'ergo-tx-queue';

const TX_IN_PROGRESS_KEY = 'ergo-tx-in-progress';

export const operationsInProgress$ = localStorageManager
  .getStream<TxInProgress[]>(TX_IN_PROGRESS_KEY)
  .pipe(
    switchMap((txsInProgress) => {
      if (!txsInProgress) {
        return of([]);
      }

      return combineLatest(
        txsInProgress.map((txInProgress) =>
          mapErgoTxToOperation(
            txInProgress.tx,
            txInProgress.params,
            OperationStatus.Pending,
          ),
        ),
      );
    }),
    publishReplay(1),
    refCount(),
  );

export const operationsInQueue$ = localStorageManager
  .getStream<TxInQueue[]>(TX_QUEUE_KEY)
  .pipe(
    switchMap((txsInQueue) => {
      if (!txsInQueue) {
        return of([]);
      }

      return combineLatest(
        txsInQueue.map((txInQueue) =>
          mapErgoTxToOperation(
            txInQueue.tx,
            txInQueue.params,
            OperationStatus.Queued,
          ),
        ),
      );
    }),
    publishReplay(1),
    refCount(),
  );

interface TxInProgress {
  readonly block: uint;
  readonly boxIds: BoxId[];
  readonly tx: ErgoTx;
  readonly params: AdditionalParams;
}

interface TxInQueue {
  readonly tx: ErgoTx;
  readonly params: AdditionalParams;
}

const hasTxInProgress = (tx: ErgoTx): boolean => {
  return !!localStorageManager
    .get<TxInProgress[]>(TX_IN_PROGRESS_KEY)
    ?.some((item) =>
      tx.inputs.some((input) => item.boxIds.includes(input.boxId)),
    );
};

const addTxToQueue = (
  tx: ErgoTx,
  params: AdditionalParams,
): Observable<TxSuccess> => {
  const newTxsQueue = localStorageManager.get<TxInQueue[]>(TX_QUEUE_KEY) || [];

  localStorageManager.set<TxInQueue[]>(
    TX_QUEUE_KEY,
    newTxsQueue.concat({ tx, params }),
  );
  console.log(tx.id);
  return of({ txId: tx.id, status: TxSuccessStatus.IN_QUEUE });
};

const addTxToProgress = (
  tx: ErgoTx,
  params: AdditionalParams,
): Observable<TxSuccess> => {
  networkContext$.pipe(first()).subscribe((ctx) => {
    const newTxsInProgress =
      localStorageManager.get<TxInProgress[]>(TX_IN_PROGRESS_KEY) || [];

    localStorageManager.set<TxInProgress[]>(
      TX_IN_PROGRESS_KEY,
      newTxsInProgress.concat({
        block: ctx.height,
        boxIds: tx.inputs.map((i) => i.boxId),
        params,
        tx,
      }),
    );
  });

  return of({ txId: '', status: TxSuccessStatus.IN_PROGRESS });
};

export const submitTx = (
  tx: ErgoTx,
  params: AdditionalParams,
): Observable<TxSuccess> => {
  if (hasTxInProgress(tx)) {
    return addTxToQueue(tx, params);
  }
  return addTxToProgress(tx, params);

  // return selectedWallet$.pipe(
  //   filter(Boolean),
  //   first(),
  //   switchMap((w) => w.submitTx(tx)),
  // );
};
