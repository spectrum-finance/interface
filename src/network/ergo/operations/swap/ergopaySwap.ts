import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$ } from '../../settings/settings';
import { ergoPaySwap as nativeErgoPaySwap } from './nativeFee/ergopaySwap';
import { ergoPaySwap as spfErgoPaySwap } from './spfFee/ergopaySwap';

export const ergoPaySwap = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  settings$
    .pipe(first())
    .pipe(
      switchMap(({ executionFeeAsset }) =>
        executionFeeAsset?.id === feeAsset.id
          ? spfErgoPaySwap(pool, from, to)
          : nativeErgoPaySwap(pool, from, to),
      ),
    );
