import { first, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const refund = (
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.refund(txId, xAmount, yAmount)),
  );
