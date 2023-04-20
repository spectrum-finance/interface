import {
  combineLatest,
  first,
  from,
  map,
  Observable,
  switchMap,
  timeout,
} from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { Currency } from '../../../../../common/models/Currency';
import { Farm } from '../../../../../common/models/Farm';
import { TxId } from '../../../../../common/types';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { ergoPayMessageManager } from '../../../operations/common/ergopayMessageManager';
import { submitErgopayTx } from '../../../operations/common/submitErgopayTx';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { lmPoolErgopayActions } from '../common/lmPoolActions';
import { createLmDepositData } from './createLmDepositData';

export const ergopayLmDeposit = (
  lmPool: Farm,
  depositAmount: Currency,
): Observable<TxId> =>
  combineLatest([networkContext$, minerFee$, settings$]).pipe(
    first(),
    map(([networkContext, minerFee, settings]) =>
      createLmDepositData({
        pool: lmPool,
        networkContext: networkContext as any,
        minerFee,
        settings,
        lpAmount: depositAmount,
      }),
    ),
    switchMap(([lqDepositConf, actionContext, additionalData]) =>
      from(lmPoolErgopayActions.deposit(lqDepositConf, actionContext)).pipe(
        map((txRequest) => ({ txRequest, additionalData })),
      ),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(txRequest, {
        p2pkaddress: additionalData.p2pkaddress,
        message: ergoPayMessageManager.stake({
          farm: additionalData.farm as any,
          x: additionalData.x,
          y: additionalData.y,
          fee: additionalData.fee,
        }),
      }),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
