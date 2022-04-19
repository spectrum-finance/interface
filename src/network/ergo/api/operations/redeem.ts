import { Observable, of } from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';

export const redeem = (pool: AmmPool, lp: Currency): Observable<TxId> => of('');
