import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxSuccess } from '../../common/services/submitTx';

export interface NetworkOperations {
  swap(pool: AmmPool, from: Currency, to: Currency): Observable<TxSuccess>;
  deposit(pool: AmmPool, x: Currency, y: Currency): Observable<TxSuccess>;
  redeem(pool: AmmPool, lp: Currency): Observable<TxSuccess>;
  refund(address: string, txId: string): Observable<TxSuccess>;
}
