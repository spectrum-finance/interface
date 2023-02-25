import { from as fromPromise, map, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { panalytics } from '../../../../common/analytics';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { ergoPayMessageManager } from '../common/ergopayMessageManager';
import { ergoPayNativeFeePoolActions } from '../common/nativeFeePoolActions';
import { submitErgopayTx } from '../common/submitErgopayTx';
import { createDepositTxData } from './createDepositTxData';

export const ergopayDeposit = (
  pool: ErgoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  createDepositTxData(pool, x, y).pipe(
    switchMap(([depositParams, txContext, additionalData]) =>
      fromPromise(
        ergoPayNativeFeePoolActions(pool.pool).deposit(
          depositParams,
          txContext,
        ),
      ).pipe(map((txRequest) => ({ txRequest, additionalData }))),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(txRequest, {
        analyticData: panalytics.buildErgopaySignedDepositEvent({
          x,
          xAsset: x.asset,
          y,
          yAsset: y.asset,
          pool,
        }),
        p2pkaddress: additionalData.p2pkaddress,
        message: ergoPayMessageManager.deposit({
          pool: additionalData.pool,
          x,
          y,
          fee: additionalData.minTotalFee,
        }),
      }),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
