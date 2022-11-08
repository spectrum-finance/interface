import { from as fromPromise, map, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { panalytics } from '../../../../common/analytics';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { ergoPayPoolActions } from '../common/poolActions';
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
        ergoPayPoolActions(pool.pool).deposit(depositParams, txContext),
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
        'deposit',
        panalytics.buildErgopaySignedDepositEvent({
          x,
          xAsset: x.asset,
          y,
          yAsset: y.asset,
          pool,
        }),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
