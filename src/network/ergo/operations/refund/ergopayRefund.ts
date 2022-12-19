import { from, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { TxId } from '../../../../common/types';
import { ergopayAmmOrderRefunds } from '../../../../services/amm';
import { submitErgopayTx } from '../common/submitErgopayTx';
import { createRefundTxData } from './createRefundTxData';

export const ergopayRefund = (
  address: string,
  txId: string,
): Observable<TxId> =>
  createRefundTxData(address, txId).pipe(
    switchMap(([refundParams, txContext, additionalData]) =>
      from(ergopayAmmOrderRefunds.refund(refundParams, txContext)).pipe(
        switchMap((txRequest) =>
          submitErgopayTx(
            txRequest,
            undefined as any,
            undefined as any,
            undefined as any,
            additionalData.minTotalFee,
            additionalData.maxTotalFee,
            additionalData.p2pkaddress,
            'refund',
            undefined,
            additionalData.address,
            additionalData.txId,
          ),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
