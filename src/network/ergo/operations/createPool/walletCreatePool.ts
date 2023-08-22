import { from, Observable, switchMap, timeout } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { submitTx } from '../../../../services/yoroi';
import { nativeFeePoolActions } from '../common/nativeFeePoolActions';
import { createCreatePoolTxData } from './createCreatePoolTxData';

export const walletCreatePool = (
  feePct: number,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  createCreatePoolTxData(feePct, x, y).pipe(
    switchMap(([poolSetupParams, txContext]) =>
      from(
        nativeFeePoolActions(poolSetupParams as any).setup(
          poolSetupParams,
          txContext,
        ),
      ).pipe(
        switchMap(([tx1, tx2]) =>
          from(submitTx(tx1).then(() => submitTx(tx2))),
        ),
      ),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
