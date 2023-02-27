import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$ } from '../../settings/settings';
import { walletDeposit as nativeWalletDeposit } from './nativeFee/walletDeposit';
import { walletDeposit as spfWalletDeposit } from './spfFee/walletDeposit';

export const walletDeposit = (
  pool: ErgoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  settings$
    .pipe(first())
    .pipe(
      switchMap(({ executionFeeAsset }) =>
        executionFeeAsset.id === feeAsset.id
          ? spfWalletDeposit(pool, x, y)
          : nativeWalletDeposit(pool, x, y),
      ),
    );
