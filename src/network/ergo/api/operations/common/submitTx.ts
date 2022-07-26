import { BoxId, ErgoTx } from '@ergolabs/ergo-sdk';
import {
  catchError,
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { OperationStatus } from '../../../../../common/models/Operation';
import {
  TxSuccess,
  TxSuccessStatus,
} from '../../../../../common/services/submitTx';
import { TxId, uint } from '../../../../../common/types';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { networkContext$ } from '../../networkContext/networkContext';
import { selectedWallet$ } from '../../wallet/wallet';
import { AdditionalParams, mapErgoTxToOperation } from './mapErgoTxOperation';
import { pendingDexOperation$ } from './pendingDexOperation';

const TX_QUEUE_KEY = 'ergo-tx-queue';

const TX_IN_PROGRESS_KEY = 'ergo-tx-in-progress';

const TX_SUBMITTING_KEY = 'ergo-tx-submitting';

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

const submitTxToBlockchain = (tx: ErgoTx): Observable<TxId> => {
  console.log(tx, 'submitting');
  return selectedWallet$.pipe(
    filter(Boolean),
    first(),
    tap((res) => console.log(res)),
    switchMap((w) => w.submitTx(tx)),
    tap((res) => console.log(res)),
  );
};

const hasTxInProgress = (
  tx: ErgoTx,
  oldInProgress?: TxInProgress[],
): boolean => {
  return !!(
    oldInProgress || localStorageManager.get<TxInProgress[]>(TX_IN_PROGRESS_KEY)
  )?.some((item) =>
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

  return of({ txId: tx.id, status: TxSuccessStatus.IN_QUEUE });
};

const addTxToProgress = (
  tx: ErgoTx,
  params: AdditionalParams,
): Observable<TxSuccess> => {
  return submitTxToBlockchain(tx).pipe(
    switchMap((txId) =>
      networkContext$.pipe(
        first(),
        map((ctx) => ({ txId, ctx })),
      ),
    ),
    tap(({ ctx }) => {
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
    }),
    map(({ txId }) => ({ txId, status: TxSuccessStatus.IN_PROGRESS })),
  );
};

export const submitTx = (
  tx: ErgoTx,
  params: AdditionalParams,
): Observable<TxSuccess> => {
  if (hasTxInProgress(tx)) {
    return addTxToQueue(tx, params);
  }
  return addTxToProgress(tx, params);
};

// Daemons
combineLatest([pendingDexOperation$, networkContext$])
  .pipe(
    catchError(() => of(undefined)),
    filter(Boolean),
  )
  .subscribe(([dexOperations, ctx]) => {
    let newTxsInProgress =
      localStorageManager.get<TxInProgress[]>(TX_IN_PROGRESS_KEY) || [];

    console.log(dexOperations, newTxsInProgress);
    if (!newTxsInProgress.length) {
      return;
    }

    // console.log(ctx.height, 'here2');
    newTxsInProgress = newTxsInProgress.filter((item) => {
      // console.log(ctx.height <= item.block, item.block, ctx.height, 'here');
      return (
        dexOperations.some((dop) => dop.txId === item.tx.id) ||
        ctx.height <= item.block + 1
      );
    });

    if (newTxsInProgress.length) {
      localStorageManager.set<TxInProgress[]>(
        TX_IN_PROGRESS_KEY,
        newTxsInProgress,
      );
    } else {
      localStorageManager.remove(TX_IN_PROGRESS_KEY);
    }
  });

//
combineLatest([
  operationsInProgress$.pipe(
    switchMap(() => localStorageManager.getStream<TxInQueue[]>(TX_QUEUE_KEY)),
    filter(Boolean),
  ),
  networkContext$,
])
  .pipe(debounceTime(200))
  .subscribe(([operationsInQueue, ctx]) => {
    const submittedOperations =
      localStorageManager.get<string[]>(TX_SUBMITTING_KEY) || [];
    const operationsInProgress =
      localStorageManager.get<TxInProgress[]>(TX_IN_PROGRESS_KEY) || [];
    let newOperationsInProgress: TxInProgress[] = [];

    const newOperationsInQueue = operationsInQueue.filter((oiq) => {
      if (
        hasTxInProgress(
          oiq.tx,
          operationsInProgress.concat(newOperationsInProgress),
        ) ||
        submittedOperations.includes(oiq.tx.id)
      ) {
        return true;
      }
      newOperationsInProgress = newOperationsInProgress.concat({
        block: ctx.height,
        boxIds: oiq.tx.inputs.map((i) => i.boxId),
        params: oiq.params,
        tx: oiq.tx,
      });
      return false;
    });

    if (!newOperationsInProgress.length) {
      return;
    }

    console.log(newOperationsInProgress);
    localStorageManager.set(TX_SUBMITTING_KEY, [
      ...submittedOperations,
      ...newOperationsInProgress.map((oip) => oip.tx.id),
    ]);
    combineLatest(
      newOperationsInProgress.map((oip) =>
        submitTxToBlockchain(oip.tx).pipe(
          mapTo(oip.tx.id),
          catchError(() => of(oip.tx.id)),
        ),
      ),
    )
      .pipe(first())
      .subscribe((submittedTxIds) => {
        console.log(submittedTxIds, 'here!!!');
        localStorageManager.set<TxInProgress[]>(
          TX_IN_PROGRESS_KEY,
          newOperationsInProgress.filter((oip) =>
            submittedTxIds.includes(oip.tx.id),
          ),
        );
        if (newOperationsInQueue.length) {
          localStorageManager.set<TxInQueue[]>(
            TX_QUEUE_KEY,
            newOperationsInQueue,
          );
        } else {
          localStorageManager.remove(TX_QUEUE_KEY);
        }
        const newSubmittingOperations = (
          localStorageManager.get<string[]>(TX_SUBMITTING_KEY) || []
        ).filter((item) => !submittedTxIds.includes(item));

        if (newSubmittingOperations.length) {
          localStorageManager.set<string[]>(
            TX_SUBMITTING_KEY,
            newSubmittingOperations,
          );
        } else {
          localStorageManager.remove(TX_SUBMITTING_KEY);
        }
      });
  });
