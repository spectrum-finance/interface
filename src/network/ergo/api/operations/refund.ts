import { Observable, of } from 'rxjs';

import { TxId } from '../../../../common/types';

export const refund = (address: string, txId: string): Observable<TxId> =>
  of('');
