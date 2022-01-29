import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  debounceTime,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Balance } from '../../../common/models/Balance';
import { explorer } from '../../../services/explorer';
import { utxos$ } from '../../../services/new/core';
import { getListAvailableTokens } from '../../../utils/getListAvailableTokens';
import { pools$ } from '../pools/pools';
import { networkAssetBalance$ } from './networkAssetBalance';

export const assetBalance$ = combineLatest([
  networkAssetBalance$,
  utxos$.pipe(switchMap(() => pools$)),
  utxos$.pipe(map((utxos) => Object.values(getListAvailableTokens(utxos)))),
]).pipe(
  debounceTime(200),
  switchMap(([networkAssetBalance, pools, boxAssets]) =>
    combineLatest<[bigint, AssetInfo][]>(
      boxAssets.map((ba) =>
        from(explorer.getFullTokenInfo(ba.tokenId)).pipe(
          map((assetInfo) => [ba.amount, assetInfo as AssetInfo]),
        ),
      ),
    ).pipe(
      map((assets) =>
        assets
          .filter(
            (a) => !!a[1] && !pools.some((p) => p.lp.asset.id === a[1].id),
          )
          .concat([[networkAssetBalance.amount, networkAssetBalance.asset]]),
      ),
    ),
  ),
  map((data) => new Balance(data as any)),
  publishReplay(1),
  refCount(),
);
