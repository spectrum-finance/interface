import { from as fromPromise, map, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
// import { panalytics } from '../../../../../common/analytics';
import { Currency } from '../../../../../common/models/Currency';
import { TxId } from '../../../../../common/types';
import { ErgoAmmPool } from '../../../api/ammPools/ErgoAmmPool';
import { ergoPayMessageManager } from '../../common/ergopayMessageManager';
import { ergoPayNativeFeePoolActions } from '../../common/nativeFeePoolActions';
import { submitErgopayTx } from '../../common/submitErgopayTx';
import { createRedeemTxData } from './createRedeemTxData';

export const ergopayRedeem = (
  pool: ErgoAmmPool,
  lp: Currency,
  x: Currency,
  y: Currency,
  percent: number,
): Observable<TxId> =>
  createRedeemTxData(pool, lp, x, y).pipe(
    switchMap(([redeemParams, txContext, additionalData]) =>
      fromPromise(
        ergoPayNativeFeePoolActions(pool.pool).redeem(redeemParams, txContext),
      ).pipe(map((txRequest) => ({ txRequest, additionalData }))),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(txRequest, {
        // analyticData: panalytics.buildErgopaySignedRedeemEvent(
        //   {
        //     xAmount: x,
        //     yAmount: y,
        //     lpAmount: lp,
        //     percent,
        //   },
        //   pool,
        // ),
        p2pkaddress: additionalData.p2pkaddress,
        message: ergoPayMessageManager.redeem({
          pool: additionalData.pool,
          fee: additionalData.minTotalFee,
          x,
          y,
        }),
      }),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
