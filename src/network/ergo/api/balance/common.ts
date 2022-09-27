import { ErgoBox } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  defaultIfEmpty,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import {
  Asset,
  getListAvailableTokens,
} from '../../../../utils/getListAvailableTokens';
import { mapToAssetInfo } from '../common/assetInfoManager';
import { utxos$ } from '../utxos/utxos';

const toListAvailableTokens = (utxos: ErgoBox[]): Asset[] =>
  Object.values(getListAvailableTokens(utxos));

export const balanceItems$: Observable<[bigint, AssetInfo][]> = utxos$.pipe(
  map(toListAvailableTokens),
  switchMap((boxAssets) =>
    combineLatest<[bigint, AssetInfo][]>(
      boxAssets.map((ba) =>
        from(mapToAssetInfo(ba.tokenId)).pipe(
          map((assetInfo) => [ba.amount, assetInfo as AssetInfo]),
        ),
      ),
    ).pipe(defaultIfEmpty([])),
  ),
  map((availableTokensData) =>
    availableTokensData.filter(([, assetInfo]) => !assetInfo.isNft),
  ),
  publishReplay(1),
  refCount(),
);
