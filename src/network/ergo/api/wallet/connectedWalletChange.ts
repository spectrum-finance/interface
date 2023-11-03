import {
  filter,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { WalletState } from '../../../common/Wallet';
import { ErgoWalletContract } from './common/ErgoWalletContract';
import { selectedWallet$, walletState$ } from './wallet';

export const connectedWalletChange$: Observable<
  ErgoWalletContract | undefined
> = selectedWallet$.pipe(
  switchMap((selectedWallet) => {
    if (!selectedWallet) {
      return of(undefined);
    }

    return walletState$.pipe(
      filter((state) => state === WalletState.CONNECTED),
      mapTo(selectedWallet),
    );
  }),
  publishReplay(1),
  refCount(),
);
