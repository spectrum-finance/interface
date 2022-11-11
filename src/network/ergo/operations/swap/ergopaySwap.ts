import { from as fromPromise, map, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { panalytics } from '../../../../common/analytics';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { ergoPayPoolActions } from '../common/poolActions';
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
        ergoPayPoolActions(pool.pool).swap(swapParams, txContext),
      ).pipe(map((txRequest) => ({ txRequest, additionalData }))),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(
        txRequest,
        from,
        to,
        additionalData.pool,
        additionalData.minTotalFee,
        additionalData.maxTotalFee,
        additionalData.p2pkaddress,
        'swap',
        panalytics.buildErgopaySignedSwapEvent({
          fromAsset: from.asset,
          fromAmount: from,
          toAmount: to,
          toAsset: to.asset,
          pool: pool,
        }),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
