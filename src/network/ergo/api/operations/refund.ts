import { Observable, of } from 'rxjs';

import { TxId } from '../../../../common/types';

export const refund = (
  address: string,
  txIs: string,
  fee: number,
): Observable<TxId> => of('');
