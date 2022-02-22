import {
  filter,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { WalletState } from '../../common';
import { selectedWallet$, selectedWalletState$ } from '../wallets';

export const getAddresses = (): Observable<string[]> =>
  selectedWalletState$.pipe(
    filter((state) => state === WalletState.CONNECTED),
    switchMap(() =>
      selectedWallet$.pipe(
        filter(Boolean),
        switchMap((wallet) =>
          zip(wallet.getUsedAddresses(), wallet.getUnusedAddresses()),
        ),
      ),
    ),
    map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  );

export const addresses$: Observable<string[]> = appTick$.pipe(
  switchMap(() => getAddresses()),
  publishReplay(1),
  refCount(),
);
