import { from, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { TxId } from '../../../../common/types';
import { ergopayAmmOrderRefunds } from '../../../../services/amm';
import { ergoPayMessageManager } from '../common/ergopayMessageManager';
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
          submitErgopayTx(txRequest, {
            p2pkaddress: additionalData.p2pkaddress,
            analyticData: undefined,
            message: ergoPayMessageManager.refund({
              address: additionalData.address,
              txId: additionalData.txId,
              fee: additionalData.minTotalFee,
            }),
          }),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
