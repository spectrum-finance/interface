import { from as fromPromise, Observable, switchMap, tap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { Currency } from '../../../../../common/models/Currency';
import { captureOperationError } from '../../../../../common/services/ErrorLogs';
import { TxId } from '../../../../../common/types';
import { ErgoAmmPool } from '../../../api/ammPools/ErgoAmmPool';
import { spfFeePoolActions } from '../../common/nativeFeePoolActions';
import { submitTx } from '../../common/submitTx';
import { createSwapTxData } from './createSwapTxData';

export const walletSwap = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  createSwapTxData(pool, from, to).pipe(
    switchMap(([swapParams, txContext]) =>
      fromPromise(spfFeePoolActions(pool.pool).swap(swapParams, txContext)),
    ),
    switchMap((tx) =>
      submitTx(tx, {
        type: 'swap',
        baseAsset: from.asset.id,
        baseAmount: from.toAmount(),
        quoteAsset: to.asset.id,
        quoteAmount: to.toAmount(),
        txId: tx.id,
      }),
    ),
    timeout(applicationConfig.operationTimeoutTime),
    tap({
      error: (error) => captureOperationError(error, 'ergo', 'Spf wallet swap'),
    }),
  );
