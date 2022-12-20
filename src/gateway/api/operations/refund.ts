import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { Operation } from '../../../common/models/Operation';
import { Address, TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const refund = (
  addresses: Address[],
  operation: Operation,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.refund(addresses, operation, xAmount, yAmount)),
  );
