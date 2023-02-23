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

import { Currency } from '../../../../../common/models/Currency';
import { Farm } from '../../../../../common/models/Farm';
import { TxId } from '../../../../../common/types';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { selectedWallet$ } from '../../../api/wallet/wallet';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { lmPoolActions } from '../common/lmPoolActions';
import { createLmDepositData } from './createLmDepositData';

export const walletLmDeposit = (
  lmPool: Farm,
  depositAmount: Currency,
): Observable<TxId> =>
  combineLatest([networkContext$, minerFee$, settings$]).pipe(
    first(),
    tap(() => console.log(lmPool)),
    map(([networkContext, minerFee, settings]) =>
      createLmDepositData({
        pool: lmPool,
        networkContext: networkContext as any,
        minerFee,
        settings,
        lpAmount: depositAmount,
      }),
    ),
    switchMap(([lqDepositConf, actionContext]) =>
      from(lmPoolActions.deposit(lqDepositConf, actionContext)),
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
