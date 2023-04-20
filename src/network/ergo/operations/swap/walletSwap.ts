import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { feeAsset } from '../../api/networkAsset/networkAsset';
import { settings$ } from '../../settings/settings';
import { walletSwap as nativeWalletSwap } from './nativeFee/walletSwap';
import { walletSwap as spfWalletSwap } from './spfFee/walletSwap';

export const walletSwap = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  settings$
    .pipe(first())
    .pipe(
      switchMap(({ executionFeeAsset }) =>
        executionFeeAsset?.id === feeAsset.id
          ? spfWalletSwap(pool, from, to)
          : nativeWalletSwap(pool, from, to),
      ),
    );
