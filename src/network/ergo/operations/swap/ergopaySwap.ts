import { from as fromPromise, map, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { panalytics } from '../../../../common/analytics';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { ergoPayMessageManager } from '../common/ergopayMessageManager';
import { ergoPayNativeFeePoolActions } from '../common/nativeFeePoolActions';
import { submitErgopayTx } from '../common/submitErgopayTx';
import { createSwapTxData } from './createSwapTxData';

export const ergoPaySwap = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  createSwapTxData(pool, from, to).pipe(
    switchMap(([swapParams, txContext, additionalData]) =>
      fromPromise(
        ergoPayNativeFeePoolActions(pool.pool).swap(swapParams, txContext),
      ).pipe(map((txRequest) => ({ txRequest, additionalData }))),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(txRequest, {
        p2pkaddress: additionalData.p2pkaddress,
        analyticData: panalytics.buildErgopaySignedSwapEvent({
          fromAsset: from.asset,
          fromAmount: from,
          toAmount: to,
          toAsset: to.asset,
          pool: pool,
        }),
        message: ergoPayMessageManager.swap({
          from,
          to,
          feeMin: additionalData.minTotalFee,
          feeMax: additionalData.maxTotalFee,
        }),
      }),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
