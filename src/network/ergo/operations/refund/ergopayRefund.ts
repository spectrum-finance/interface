import { from, Observable, of, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { TxId } from '../../../../common/types';
import { ergopayAmmOrderRefunds } from '../../../../services/amm';
import { createRefundTxData } from './createRefundTxData';

export const ergopayRefund = (
  address: string,
  txId: string,
): Observable<TxId> =>
  createRefundTxData(address, txId).pipe(
    switchMap(([refundParams, txContext]) =>
      from(ergopayAmmOrderRefunds.refund(refundParams, txContext)).pipe(
        switchMap((txRequest) =>
          // submitErgopayTx(txRequest, {
          //   txId: tx.id,
          //   type: 'refund',
          // }),
          of(''),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
