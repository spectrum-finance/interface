import { from, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { Currency } from '../../../../../common/models/Currency';
import { TxId } from '../../../../../common/types';
import { ErgoAmmPool } from '../../../api/ammPools/ErgoAmmPool';
import { nativeFeePoolActions } from '../../common/nativeFeePoolActions';
import { submitTx } from '../../common/submitTx';
import { createDepositTxData } from './createDepositTxData';

export const walletDeposit = (
  pool: ErgoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  createDepositTxData(pool, x, y).pipe(
    switchMap(([depositParams, txContext]) =>
      from(
        nativeFeePoolActions(pool.pool).deposit(depositParams, txContext),
      ).pipe(
        switchMap((tx) =>
          submitTx(tx, {
            type: 'deposit',
            xAsset: x.asset.id,
            xAmount: x.toAmount(),
            yAsset: y.asset.id,
            yAmount: y.toAmount(),
            txId: tx.id,
          }),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
