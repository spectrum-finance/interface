import { TxRequest } from '@ergolabs/ergo-sdk';
import axios from 'axios';
import { first, from as fromPromise, map, Observable, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { TxId } from '../../../../common/types';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { networkContext$ } from '../../api/networkContext/networkContext';

export interface SubmitErgopayTxParams {
  readonly analyticData?: Record<string, any>;
  readonly p2pkaddress: string;
  readonly message: string;
}

export const submitErgopayTx = (
  txRequest: TxRequest,
  params: SubmitErgopayTxParams,
): Observable<TxId> =>
  networkContext$.pipe(
    first(),
    map((ctx) => mainnetTxAssembler.assemble(txRequest, ctx as any)),
    map((unsignedTx) =>
      JSON.parse(
        JSON.stringify(unsignedTx, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    ),
    switchMap((unsignedTx) =>
      fromPromise(
        axios.post<{ txId: TxId }>(
          `${applicationConfig.networksSettings.ergo.ergopayUrl}/unsignedTx`,
          {
            unsignedTx,
            analyticData: params.analyticData,
            p2pkaddress: params.p2pkaddress,
            message: params.message,
          },
        ),
      ),
    ),
    map((res) => res.data.txId),
  );
