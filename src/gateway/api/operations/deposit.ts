import { first, Observable, switchMap } from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TxSuccess } from '../../../common/services/submitTx';
import { selectedNetwork$ } from '../../common/network';

export const deposit = (
  pool: AmmPool,
  x: Currency,
  y: Currency,
): Observable<TxSuccess> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.deposit(pool, x, y)),
  );
