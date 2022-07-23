import { first, Observable, switchMap } from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TxSuccess } from '../../../common/services/submitTx';
import { selectedNetwork$ } from '../../common/network';

export const swap = (
  pool: AmmPool,
  from: Currency,
  to: Currency,
): Observable<TxSuccess> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.swap(pool, from, to)),
  );
