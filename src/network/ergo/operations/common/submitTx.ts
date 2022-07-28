import { ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, Observable, switchMap } from 'rxjs';

import { TxId } from '../../../../common/types';
import { selectedWallet$ } from '../../api/wallet/wallet';

export const submitTx = (tx: ErgoTx): Observable<TxId> =>
  selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => w.submitTx(tx)),
  );
