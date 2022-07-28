import { ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, mapTo, Observable, switchMap } from 'rxjs';

import { TxId } from '../../../../common/types';
import {
  addToQueue,
  OperationParams,
} from '../../api/operations/pending/queuedOperation';
import { selectedWallet$ } from '../../api/wallet/wallet';

export const submitTx = (
  tx: ErgoTx,
  params: OperationParams,
): Observable<TxId> =>
  selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => w.submitTx(tx)),
    switchMap((txId) => addToQueue(tx, params).pipe(mapTo(txId))),
  );
