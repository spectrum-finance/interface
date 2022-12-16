import { first, Observable, switchMap } from 'rxjs';

import { LmPool } from '../../../common/models/LmPool';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const lmRedeem = (lmPool: LmPool): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.lmRedeem(lmPool)),
  );
