import { from, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { Currency } from '../../../../../common/models/Currency';
import { TxId } from '../../../../../common/types';
import { ErgoAmmPool } from '../../../api/ammPools/ErgoAmmPool';
import { spfFeePoolActions } from '../../common/nativeFeePoolActions';
import { submitTx } from '../../common/submitTx';
import { createRedeemTxData } from './createRedeemTxData';

export const walletRedeem = (
  pool: ErgoAmmPool,
  lp: Currency,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  createRedeemTxData(pool, lp, x, y).pipe(
    switchMap(([redeemParams, txContext]) =>
      from(spfFeePoolActions(pool.pool).redeem(redeemParams, txContext)).pipe(
        switchMap((tx) =>
          submitTx(tx, {
            type: 'redeem',
            txId: tx.id,
            xAmount: x.toAmount(),
            xAsset: x.asset.id,
            yAmount: y.toAmount(),
            yAsset: y.asset.id,
          }),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
