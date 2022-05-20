import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';

export interface NetworkOperations {
  swap(pool: AmmPool, from: Currency, to: Currency): Observable<TxId>;
  deposit(pool: AmmPool, x: Currency, y: Currency): Observable<TxId>;
  redeem(pool: AmmPool, lp: Currency): Observable<TxId>;
  refund(address: string, txId: string): Observable<TxId>;
}
