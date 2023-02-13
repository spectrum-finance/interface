import { ReactNode } from 'react';
import { first, Observable, switchMap } from 'rxjs';

import { Farm } from '../../../common/models/Farm';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const lmRedeem = (
  farm: Farm,
  createFarmModal: (
    children?: ReactNode | ReactNode[] | string,
  ) => ReactNode | ReactNode[] | string,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.lmRedeem(farm, createFarmModal)),
  );
