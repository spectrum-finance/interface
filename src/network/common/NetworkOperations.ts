import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';

export interface NetworkOperations {
  swap(pool: AmmPool, from: Currency, to: Currency): Observable<TxId>;
}
