import { first, Observable, switchMap } from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { TxId } from '../../../common/types';
import { RemoveFormModel } from '../../../pages/RemoveLiquidity/RemoveLiquidity';
import { selectedNetwork$ } from '../../common/network';

export const redeem = (
  pool: AmmPool,
  data: Required<RemoveFormModel>,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.redeem(pool, data)),
  );
