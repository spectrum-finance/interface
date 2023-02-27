import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$ } from '../../settings/settings';
import { ergopayRedeem as nativeErgoPayRedeem } from './nativeFee/ergopayRedeem';
import { ergopayRedeem as spfErgoPayRedeem } from './spfFee/ergopayRedeem';

export const ergoPayRedeem = (
  pool: ErgoAmmPool,
  lp: Currency,
  x: Currency,
  y: Currency,
  percent: number,
): Observable<TxId> =>
  settings$
    .pipe(first())
    .pipe(
      switchMap(({ executionFeeAsset }) =>
        executionFeeAsset.id === feeAsset.id
          ? spfErgoPayRedeem(pool, lp, x, y, percent)
          : nativeErgoPayRedeem(pool, lp, x, y, percent),
      ),
    );
