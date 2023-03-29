import {
  from,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  timeout,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { TxId } from '../../../../common/types';
import { ammOrderRefunds } from '../../../../services/amm';
import { submitTx } from '../common/submitTx';
import { createRefundTxData } from './createRefundTxData';

export const walletRefund = (address: string, txId: string): Observable<TxId> =>
  createRefundTxData(address, txId).pipe(
    switchMap(([refundParams, txContext]) =>
      from(ammOrderRefunds.refund(refundParams, txContext)).pipe(
        switchMap((tx) =>
          submitTx(tx, {
            txId: tx.id,
            type: 'refund',
          }),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
    publishReplay(1),
    refCount(),
  );
