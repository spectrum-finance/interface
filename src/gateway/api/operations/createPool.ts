import { first, Observable, switchMap } from 'rxjs';

import { TxId } from '../../../common/types';
import { CreatePoolFormModel } from '../../../pages/CreatePool/CreatePoolFormModel';
import { selectedNetwork$ } from '../../common/network';

export const createPool = (
  data: Required<CreatePoolFormModel>,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.createPool(data)),
  );
