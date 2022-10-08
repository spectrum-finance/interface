import { first, Observable, switchMap } from 'rxjs';

import { TxId } from '../../../common/types';
import { SwapFormModel } from '../../../pages/Swap/SwapFormModel';
import { selectedNetwork$ } from '../../common/network';

export const swap = (data: Required<SwapFormModel>): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.swap(data)),
  );
