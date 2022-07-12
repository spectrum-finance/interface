import uniqBy from 'lodash/uniqBy';
import {
  combineLatest,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { allAmmPools$ } from '../ammPools/ammPools';
import { mapToAssetInfo } from '../common/assetInfoManager';
import {
  filterAvailableTokenAssets,
  filterUnavailableTokenAssets,
} from '../common/availablePoolsOrTokens';

export const availableTokenAssets$: Observable<AssetInfo[]> = allAmmPools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  switchMap(filterUnavailableTokenAssets),
  switchMap((assets) =>
    combineLatest(assets.map((ai) => mapToAssetInfo(ai.id))),
  ),
  map((assets) => assets.filter(Boolean) as AssetInfo[]),
  publishReplay(1),
  refCount(),
);

export const tokenAssetsToImport$ = allAmmPools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  switchMap(filterAvailableTokenAssets),
  switchMap((assets) =>
    combineLatest(assets.map((ai) => mapToAssetInfo(ai.id))),
  ),
  map((assets) => assets.filter(Boolean) as AssetInfo[]),
  publishReplay(1),
  refCount(),
);
