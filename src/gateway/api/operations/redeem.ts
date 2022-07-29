import { first, Observable, switchMap } from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const redeem = (
  pool: AmmPool,
  liquidity: Currency,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.redeem(pool, liquidity, x, y)),
  );
