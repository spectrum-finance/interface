import { Address } from '@ergolabs/ergo-sdk';
import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { Farm } from '../../common/models/Farm';
import { Operation } from '../../common/models/Operation';
import { TxId } from '../../common/types';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { RemoveLiquidityFormModel } from '../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { lmRedeem } from '../ergo/lm/api/lmRedeem/lmRedeem';

export interface NetworkOperations {
  swap(data: Required<SwapFormModel>): Observable<TxId>;
  lmRedeem(lmPool: Farm): Observable<TxId>;
  lmDeposit(lmPool: Farm): Observable<TxId>;
  deposit(data: Required<AddLiquidityFormModel>): Observable<TxId>;
  redeem(
    pool: AmmPool,
    data: Required<RemoveLiquidityFormModel>,
  ): Observable<TxId>;
  refund(
    addresses: Address[],
    operation: Operation,
    xAmount: Currency,
    yAmount: Currency,
  ): Observable<TxId>;
}
