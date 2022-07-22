import { BoxId, ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, Observable, of, switchMap, tap } from 'rxjs';

import { TxId, uint } from '../../../../../common/types';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { networkContext$ } from '../../networkContext/networkContext';
import { selectedWallet$ } from '../../wallet/wallet';

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

const addTxToQueue = (tx: ErgoTx): void => {
  const newTxsQueue = localStorageManager.get<ErgoTx[]>(TX_QUEUE_KEY) || [];

  localStorageManager.set<ErgoTx[]>(TX_QUEUE_KEY, newTxsQueue.concat(tx));
};

const addTxToProgress = (tx: ErgoTx): void => {
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
};

export const submitTx = (tx: ErgoTx): Observable<TxId> => {
  if (hasTxInProgress(tx)) {
    addTxToQueue(tx);
    return of('');
  }

  return selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => w.submitTx(tx)),
  );
};
