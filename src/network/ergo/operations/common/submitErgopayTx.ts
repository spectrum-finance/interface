import { TxRequest } from '@ergolabs/ergo-sdk';
import axios from 'axios';
import { first, from as fromPromise, map, Observable, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { networkContext$ } from '../../api/networkContext/networkContext';
import { ergoPayMessageManager } from './ergopayMessageManager';

export const submitErgopayTx = (
  txRequest: TxRequest,
  from: Currency,
  to: Currency,
  pool: AmmPool,
  feeMin: Currency,
  feeMax: Currency,
  operation: keyof typeof ergoPayMessageManager,
): Observable<TxId> =>
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
          {
            unsignedTx,
            message:
              operation === 'swap'
                ? ergoPayMessageManager.swap(from, to, feeMin, feeMax)
                : ergoPayMessageManager.deposit(from, to, pool, feeMin, feeMax),
          },
        ),
      ),
    ),
    map((res) => res.data.txId),
  );
