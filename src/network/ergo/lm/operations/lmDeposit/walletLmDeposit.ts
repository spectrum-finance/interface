import { combineLatest, filter, first, from, map, switchMap, tap } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import { Farm } from '../../../../../common/models/Farm';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { selectedWallet$ } from '../../../api/wallet/wallet';
import { minerFee$ } from '../../../settings/minerFee';
import { settings$ } from '../../../settings/settings';
import { lmPoolActions } from '../common/lmPoolActions';
import { createLmDepositData } from './createLmDepositData';

export const walletLmDeposit = (lmPool: Farm, depositAmount: Currency): any => {
  combineLatest([networkContext$, minerFee$, settings$])
    .pipe(
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
      switchMap(([lqDepositConf, actionContext]) =>
        from(lmPoolActions.deposit(lqDepositConf, actionContext)),
      ),
      switchMap((ergoTx) =>
        selectedWallet$.pipe(
          filter(Boolean),
          first(),
          switchMap((w) => w.submitTx(ergoTx)),
        ),
      ),
    )
    .subscribe(console.log);
};
