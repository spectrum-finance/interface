import { Observable, of, retry } from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';

export const swap = (
  pool: AmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> => of('');
