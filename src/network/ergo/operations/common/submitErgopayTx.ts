import { TxRequest } from '@ergolabs/ergo-sdk';
import axios from 'axios';
import { first, from as fromPromise, map, Observable, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { TxId } from '../../../../common/types';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { networkContext$ } from '../../api/networkContext/networkContext';

export const submitErgopayTx = (txRequest: TxRequest): Observable<TxId> =>
  networkContext$.pipe(
    first(),
    map((ctx) => mainnetTxAssembler.assemble(txRequest, ctx as any)),
    map((unsignedTx) =>
      JSON.parse(
        JSON.stringify(unsignedTx, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    ),
    switchMap((unsignedTx) =>
      fromPromise(
        axios.post<{ txId: TxId }>(
          `${applicationConfig.networksSettings.ergo.ergopayUrl}unsignedTx`,
          { unsignedTx, message: 'test' },
        ),
      ),
    ),
    map((res) => res.data.txId),
  );
