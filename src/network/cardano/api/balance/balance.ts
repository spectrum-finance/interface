import { AssetEntry } from '@teddyswap/cardano-dex-sdk';
import {
  combineLatest,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';
import { networkContext$ } from '../networkContext/networkContext';
import { AdditionalData } from '../wallet/common/AdditionalData';
import { Wallet } from '../wallet/common/Wallet';
import { connectedWalletChange$ } from '../wallet/connectedWalletChange';

export const balanceItemsWithUndefined$: Observable<
  [bigint, AssetInfo][] | undefined
> = connectedWalletChange$.pipe(
  switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
  switchMap((selectedWallet: Wallet<AdditionalData> | undefined) =>
    selectedWallet ? selectedWallet.getBalance() : of(undefined),
  ),
  switchMap((rawBalance) => {
    return rawBalance
      ? combineLatest(
          rawBalance.map((item: AssetEntry) =>
            mapAssetClassToAssetInfo(item).pipe(
              map<AssetInfo, [bigint, AssetInfo]>((ai) => [item.quantity, ai]),
            ),
          ),
        )
      : of(undefined);
  }),
  publishReplay(1),
  refCount(),
);

export const balanceItems$: Observable<[bigint, AssetInfo][]> =
  balanceItemsWithUndefined$.pipe(
    map((balanceItems) => balanceItems || []),
    publishReplay(1),
    refCount(),
  );
