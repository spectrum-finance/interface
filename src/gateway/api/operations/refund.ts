import { first, Observable, switchMap } from 'rxjs';

import { TxSuccess } from '../../../common/services/submitTx';
import { Address, TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const refund = (address: Address, txId: TxId): Observable<TxSuccess> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.refund(address, txId)),
  );
