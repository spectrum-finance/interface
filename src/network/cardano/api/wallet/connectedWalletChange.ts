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
import { CardanoWalletContract } from './common/CardanoWalletContract';
import { selectedWallet$, walletState$ } from './wallet';

// TODO: RENAME
export const connectedWalletChange$: Observable<
  CardanoWalletContract | undefined
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
