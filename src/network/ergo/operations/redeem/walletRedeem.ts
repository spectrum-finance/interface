import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$ } from '../../settings/settings';
import { walletRedeem as nativeWalletRedeem } from './nativeFee/walletRedeem';
import { walletRedeem as spfWalletRedeem } from './spfFee/walletRedeem';

export const walletRedeem = (
  pool: ErgoAmmPool,
  lp: Currency,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  settings$
    .pipe(first())
    .pipe(
      switchMap(({ executionFeeAsset }) =>
        executionFeeAsset?.id === feeAsset.id
          ? spfWalletRedeem(pool, lp, x, y)
          : nativeWalletRedeem(pool, lp, x, y),
      ),
    );
