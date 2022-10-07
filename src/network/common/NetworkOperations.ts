import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';

export interface NetworkOperations {
  swap(data: Required<SwapFormModel>): Observable<TxId>;
  deposit(data: Required<AddLiquidityFormModel>): Observable<TxId>;
  redeem(
    pool: AmmPool,
    lp: Currency,
    x: Currency,
    y: Currency,
  ): Observable<TxId>;
  refund(address: string, txId: string): Observable<TxId>;
}
