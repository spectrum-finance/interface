import {
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Balance } from '../../../../common/models/Balance';
import { networkContext$ } from '../networkContext/networkContext';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const balanceItems$: Observable<[bigint, AssetInfo][]> =
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
    switchMap((selectedWallet) =>
      selectedWallet ? selectedWallet.getBalance() : of([]),
    ),
    publishReplay(1),
    refCount(),
  );
