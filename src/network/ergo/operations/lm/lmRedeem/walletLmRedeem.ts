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
import { ErgoLmPool } from '../../../api/lmPools/ErgoLmPool';
import { ExtendedStake } from '../../../api/lmStake/lmStake';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { selectedWallet$ } from '../../../api/wallet/wallet';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { lmPoolActions } from '../common/lmPoolActions';
import { createLmRedeemData } from './createLmRedeemData';

export const walletLmRedeem = (
  ergoLmPool: ErgoLmPool,
  stakes: ExtendedStake[],
): Observable<any> =>
  combineLatest([networkContext$, minerFee$, settings$]).pipe(
    first(),
    map(([networkContext, minerFee, settings]) =>
      stakes.map((stake) =>
        createLmRedeemData({
          pool: ergoLmPool,
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
