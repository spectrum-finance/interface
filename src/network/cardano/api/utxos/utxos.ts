import { mapTo, of, publishReplay, refCount, switchMap } from 'rxjs';

import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const utxos$ = connectedWalletChange$.pipe(
  // switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getBalance() : of(undefined),
  ),
  publishReplay(1),
  refCount(),
);
