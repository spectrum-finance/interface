import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { first, Observable, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../common/network';

export const getOperationByTxId = (
  txId: string,
): Observable<AmmDexOperation | undefined> =>
  selectedNetwork$.pipe(
    first(),
    switchMap((network) => network.getOperationByTxId(txId)),
  );
