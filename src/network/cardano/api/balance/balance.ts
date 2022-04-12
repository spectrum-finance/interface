import { Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const balance$: Observable<Balance> = connectedWalletChange$.pipe(
  // switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getBalance() : of(new Balance([])),
  ),
  publishReplay(1),
  refCount(),
);
