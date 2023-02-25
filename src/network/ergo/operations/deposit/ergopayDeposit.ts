import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$ } from '../../settings/settings';
import { ergopayDeposit as nativeErgoPayDeposit } from './nativeFee/ergopayDeposit';
import { ergopayDeposit as spfErgoPayDeposit } from './spfFee/ergopayDeposit';

export const ergoPaySwap = (
  pool: ErgoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  settings$
    .pipe(first())
    .pipe(
      switchMap(({ executionFeeAsset }) =>
        executionFeeAsset.id === feeAsset.id
          ? spfErgoPayDeposit(pool, x, y)
          : nativeErgoPayDeposit(pool, x, y),
      ),
    );
