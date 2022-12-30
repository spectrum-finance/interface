import {
  combineLatest,
  first,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { networkContext$ } from '../../../api/networkContext/networkContext';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { ErgoFarm } from '../../models/ErgoFarm';
import { Stake } from '../../models/Stake';
import { lmPoolActions } from '../common/lmPoolActions';
import { createLmRedeemData } from './createLmRedeemData';

export const walletLmRedeem = (
  ergoLmPool: ErgoFarm,
  stakes: Stake[],
): Observable<any> =>
  combineLatest([networkContext$, minerFee$, settings$]).pipe(
    first(),
    map(([networkContext, minerFee, settings]) =>
      stakes.map((stake) =>
        createLmRedeemData({
          lmPool: ergoLmPool,
          networkContext: networkContext as any,
          minerFee,
          settings,
          stake,
        }),
      ),
    ),
    switchMap((txsData) =>
      combineLatest(
        txsData.map(([lqRedeemConf, actionContext]) =>
          from(lmPoolActions.redeem(lqRedeemConf, actionContext)),
        ),
      ),
    ),
    tap((res) => console.log(res)),
    // switchMap((ergoTx) =>
    //   selectedWallet$.pipe(
    //     filter(Boolean),
    //     first(),
    //     switchMap((w) => w.submitTx(ergoTx)),
    //   ),
    // ),
  );
