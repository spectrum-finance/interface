import { ActionContext } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/actionContext';
import { LqRedeemConf } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/poolOpParams';
import {
  combineLatest,
  filter,
  first,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { TxId } from '../../../../../common/types';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { selectedWallet$ } from '../../../api/wallet/wallet';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { ErgoFarm } from '../../models/ErgoFarm';
import { Stake } from '../../models/Stake';
import { lmPoolActions } from '../common/lmPoolActions';
import { createLmRedeemData } from './createLmRedeemData';

export const walletLmRedeem = (
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
    switchMap(([lqRedeemConf, actionContext]) =>
      from(lmPoolActions.redeem(lqRedeemConf, actionContext)),
    ),
    tap(console.log, console.log),
    switchMap((ergoTx) =>
      selectedWallet$.pipe(
        filter(Boolean),
        first(),
        switchMap((w) => w.submitTx(ergoTx)),
      ),
    ),
    tap(console.log, console.log),
  );
