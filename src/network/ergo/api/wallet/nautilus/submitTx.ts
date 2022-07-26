import { ErgoTx, ergoTxToProxy } from '@ergolabs/ergo-sdk';
import { from, Observable } from 'rxjs';

import { TxId } from '../../../../../common/types';

export const submitTx = (tx: ErgoTx): Observable<TxId> =>
  from(
    ergoConnector.nautilus
      .getContext()
      .then((context) => {
        return context
          .submit_tx(ergoTxToProxy(tx))
          .then((txId) => {
            console.log(txId);
            return txId;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      }),
  );
