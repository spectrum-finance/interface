import { first, Observable, switchMap } from 'rxjs';

import { TxId } from '../../../common/types';
import { AddLiquidityFormModel } from '../../../components/AddLiquidityForm/AddLiquidityFormModel';
import { selectedNetwork$ } from '../../common/network';

export const deposit = (
  data: Required<AddLiquidityFormModel>,
  withoutConfirmation?: boolean,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.deposit(data, withoutConfirmation)),
  );
