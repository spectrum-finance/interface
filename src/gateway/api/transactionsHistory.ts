import { first, Observable, switchMap } from 'rxjs';

import { Operation } from '../../common/models/Operation';
import { selectedNetwork$ } from '../common/network';

export const getOperationByTxId = (
  txId: string,
): Observable<Operation | undefined> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((network) => network.getOperationByTxId(txId)),
  );
