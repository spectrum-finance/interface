import { first, Observable, switchMap } from 'rxjs';

import { Farm } from '../../../common/models/Farm';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const lmDeposit = (lmPool: Farm): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.lmDeposit(lmPool)),
  );
