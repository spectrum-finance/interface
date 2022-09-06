import { first, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const deposit = (
  pool: AmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.deposit(pool, x, y)),
    timeout(applicationConfig.operationTimeoutTime),
  );
