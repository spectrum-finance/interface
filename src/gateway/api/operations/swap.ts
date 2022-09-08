import { first, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const swap = (
  pool: AmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.swap(pool, from, to)),
    timeout(applicationConfig.operationTimeoutTime),
  );
