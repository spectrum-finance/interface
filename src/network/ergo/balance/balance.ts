import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  debounceTime,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Balance } from '../../../common/models/Balance';
import { utxos$ } from '../../../services/new/core';
import { getListAvailableTokens } from '../../../utils/getListAvailableTokens';
import { assets$ } from '../assets/assets';
import { ERGO_ID } from '../networkAsset/networkAsset';
import { networkAssetBalance$ } from './networkAssetBalance';

export const assetBalance$ = combineLatest([
  networkAssetBalance$,
  utxos$.pipe(switchMap(() => assets$)),
  utxos$.pipe(map((utxos) => Object.values(getListAvailableTokens(utxos)))),
]).pipe(
  debounceTime(200),
  map(([networkAssetBalance, assets, boxAssets]) =>
    boxAssets
      .map<[bigint, AssetInfo]>((ba) => [
        ba.amount,
        assets.find((a) => a.id === ba.tokenId)!,
      ])
      .concat([
        [networkAssetBalance.amount, assets.find((a) => a.id === ERGO_ID)!],
      ])
      .filter((i) => !!i[1]),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
