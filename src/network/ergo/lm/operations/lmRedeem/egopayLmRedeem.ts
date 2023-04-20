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
import { TxId } from '../../../../../common/types';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { ergoPayMessageManager } from '../../../operations/common/ergopayMessageManager';
import { submitErgopayTx } from '../../../operations/common/submitErgopayTx';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { ErgoFarm } from '../../models/ErgoFarm';
import { Stake } from '../../models/Stake';
import { lmPoolErgopayActions } from '../common/lmPoolActions';
import { createLmRedeemData } from './createLmRedeemData';

export const ergoPayLmRedeem = (
  ergoLmPool: ErgoFarm,
  stake: Stake,
): Observable<TxId> =>
  combineLatest([networkContext$, minerFee$, settings$]).pipe(
    first(),
    map(([networkContext, minerFee, settings]) =>
      createLmRedeemData({
        lmPool: ergoLmPool,
        networkContext: networkContext as any,
        minerFee,
        settings,
        stake,
      }),
    ),
    switchMap(([lqRedeemConf, actionContext, additionalData]) =>
      from(lmPoolErgopayActions.redeem(lqRedeemConf, actionContext)).pipe(
        map((txRequest) => ({ txRequest, additionalData })),
      ),
    ),
    switchMap(({ txRequest, additionalData }) =>
      submitErgopayTx(txRequest, {
        p2pkaddress: additionalData.p2pkaddress,
        message: ergoPayMessageManager.unstake({
          farm: additionalData.farm as any,
          x: additionalData.x,
          y: additionalData.y,
          fee: additionalData.fee,
        }),
      }),
    ),
    timeout(applicationConfig.operationTimeoutTime),
  );
