import { ErgoTx, ergoTxToProxy } from '@ergolabs/ergo-sdk';
import { from, Observable } from 'rxjs';

import { TxId } from '../../../../../common/types';

export const submitTx = (tx: ErgoTx): Observable<TxId> =>
  from(ergo.submit_tx(ergoTxToProxy(tx)));
