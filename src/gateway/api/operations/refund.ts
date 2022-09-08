import { first, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { Address, TxId } from '../../../common/types';
import { selectedNetwork$ } from '../../common/network';

export const refund = (address: Address, txId: TxId): Observable<TxId> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((n) => n.refund(address, txId)),
    timeout(applicationConfig.operationTimeoutTime),
  );
