import { from as fromPromise, map, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { panalytics } from '../../../../common/analytics';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { ergoPayPoolActions } from '../common/poolActions';
import { submitErgopayTx } from '../common/submitErgopayTx';
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
        ergoPayPoolActions(pool.pool).redeem(redeemParams, txContext),
      ).pipe(map((txRequest) => ({ txRequest, additionalData }))),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(
        txRequest,
        x,
        y,
        additionalData.pool,
        additionalData.minTotalFee,
        additionalData.maxTotalFee,
        additionalData.p2pkaddress,
        'redeem',
        panalytics.buildErgopaySignedRedeemEvent(
          {
            xAmount: x,
            yAmount: y,
            lpAmount: lp,
            percent,
          },
          pool,
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
