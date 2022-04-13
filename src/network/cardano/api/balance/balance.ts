import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import {
  combineLatest,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Balance } from '../../../../common/models/Balance';
import { getAssetInfo } from '../assetManager/getAssetInfo';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const balance$: Observable<Balance> = connectedWalletChange$.pipe(
  // switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
  switchMap((selectedWallet) =>
    selectedWallet ? selectedWallet.getBalance() : of(undefined),
  ),
  switchMap((data) => {
    if (!data?.length) {
      return of([]);
    }
    return combineLatest(
      data.map((item) =>
        getAssetInfo(item).pipe(
          map((info) => [
            item.quantity,
            {
              name: info?.name.value || item.name,
              id: info?.subject || item.name,
              decimals: info?.decimals.value || 0,
            },
          ]),
        ),
      ),
    );
  }),
  map((items) => new Balance(items as any)),
  publishReplay(1),
  refCount(),
);
