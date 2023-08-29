import { first, Observable, switchMap } from 'rxjs';

import { AmmPool } from '../../../common/models/AmmPool';
import { TxId } from '../../../common/types';
import { RemoveLiquidityFormModel } from '../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { selectedNetwork$ } from '../../common/network';

export const redeem = (
  pool: AmmPool,
  data: Required<RemoveLiquidityFormModel>,
  withoutConfirmation?: boolean,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.redeem(pool, data, withoutConfirmation)),
  );
