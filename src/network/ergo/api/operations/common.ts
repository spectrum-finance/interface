import { makeDefaultPoolActionsSelector } from '@ergolabs/ergo-dex-sdk';
import { ErgoTx } from '@ergolabs/ergo-sdk';
import { filter, first, Observable, switchMap } from 'rxjs';

import { UI_REWARD_ADDRESS } from '../../../../common/constants/settings';
import { TxId } from '../../../../common/types';
import { mainnetTxAssembler } from '../../../../services/defaultTxAssembler';
import { selectedWallet$ } from '../wallet/wallet';
import { proverMediator } from './proverMediator';

export const submitTx = (tx: ErgoTx): Observable<TxId> =>
  selectedWallet$.pipe(
    filter(Boolean),
    first(),
    switchMap((w) => w.submitTx(tx)),
  );

export const poolActions = makeDefaultPoolActionsSelector(
  proverMediator,
  mainnetTxAssembler,
  UI_REWARD_ADDRESS,
);
