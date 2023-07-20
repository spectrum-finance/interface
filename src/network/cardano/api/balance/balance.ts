import { AssetEntry } from '@spectrumlabs/cardano-dex-sdk';
import {
  combineLatest,
  defaultIfEmpty,
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

export const balanceItems$: Observable<[bigint, AssetInfo][]> =
  connectedWalletChange$.pipe(
    switchMap((selectedWallet) => networkContext$.pipe(mapTo(selectedWallet))),
    switchMap((selectedWallet: Wallet<AdditionalData> | undefined) =>
      selectedWallet ? selectedWallet.getBalance() : of([]),
    ),
    switchMap((rawBalance) =>
      combineLatest(
        rawBalance.map((item: AssetEntry) =>
          mapAssetClassToAssetInfo(item).pipe(
            map<AssetInfo, [bigint, AssetInfo]>((ai) => [item.quantity, ai]),
          ),
        ),
      ).pipe(defaultIfEmpty([])),
    ),
    publishReplay(1),
    refCount(),
  );
