import { BoxId, ErgoTx } from '@ergolabs/ergo-sdk';
import { first, Observable, of } from 'rxjs';

import {
  TxSuccess,
  TxSuccessStatus,
} from '../../../../../common/services/submitTx';
import { uint } from '../../../../../common/types';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { networkContext$ } from '../../networkContext/networkContext';

const TX_QUEUE_KEY = 'ergo-tx-queue';

const TX_IN_PROGRESS_KEY = 'ergo-tx-in-progress';

interface TxInProgress {
  readonly block: uint;
  readonly boxIds: BoxId[];
  readonly tx: ErgoTx;
}

const hasTxInProgress = (tx: ErgoTx): boolean => {
  return !!localStorageManager
    .get<TxInProgress[]>(TX_IN_PROGRESS_KEY)
    ?.some((item) =>
      tx.inputs.some((input) => item.boxIds.includes(input.boxId)),
    );
};

const addTxToQueue = (tx: ErgoTx): Observable<TxSuccess> => {
  const newTxsQueue = localStorageManager.get<ErgoTx[]>(TX_QUEUE_KEY) || [];

  localStorageManager.set<ErgoTx[]>(TX_QUEUE_KEY, newTxsQueue.concat(tx));

  return of({ txId: '', status: TxSuccessStatus.IN_QUEUE });
};

const addTxToProgress = (tx: ErgoTx): Observable<TxSuccess> => {
  networkContext$.pipe(first()).subscribe((ctx) => {
    const newTxsInProgress =
      localStorageManager.get<TxInProgress[]>(TX_IN_PROGRESS_KEY) || [];

    localStorageManager.set<TxInProgress[]>(
      TX_IN_PROGRESS_KEY,
      newTxsInProgress.concat({
        block: ctx.height,
        boxIds: tx.inputs.map((i) => i.boxId),
        tx,
      }),
    );
  });

  return of({ txId: '', status: TxSuccessStatus.IN_PROGRESS });
};

export const submitTx = (tx: ErgoTx): Observable<TxSuccess> => {
  if (hasTxInProgress(tx)) {
    return addTxToQueue(tx);
  }
  return addTxToProgress(tx);

  // return selectedWallet$.pipe(
  //   filter(Boolean),
  //   first(),
  //   switchMap((w) => w.submitTx(tx)),
  // );
};
