import uniqBy from 'lodash/uniqBy';
import {
  combineLatest,
  defaultIfEmpty,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';
import { ammPools$ } from '../ammPools/ammPools';
import { mapToAssetInfo } from '../common/assetInfoManager';
import {
  filterAvailableTokenAssets,
  filterUnavailableAndDefaultTokenAssets,
  filterUnavailableAndImportedTokenAssets,
} from '../common/availablePoolsOrTokens';

const assets$: Observable<AssetInfo[]> = ammPools$.pipe(
  map((ammPools) => ammPools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

const getAssetFor = (
  assetId: string,
  availableAssets: AssetInfo[],
): Observable<AssetInfo[]> =>
  ammPools$.pipe(
    map((ammPools) =>
      ammPools.filter(
        (p) => p.x.asset.id === assetId || p.y.asset.id === assetId,
      ),
    ),
    map((ammPools) =>
      ammPools
        .flatMap((p) => [
          p.x.asset.id !== assetId ? p.x.asset : undefined,
          p.y.asset.id !== assetId ? p.y.asset : undefined,
        ])
        .filter<AssetInfo>(Boolean as any),
    ),
    map((assets) => uniqBy(assets, 'id')),
    map((assets) =>
      assets.filter((a) => !!availableAssets.find((aa) => aa.id === a.id)),
    ),
  );

export const defaultAssets$: Observable<AssetInfo[]> = assets$.pipe(
  switchMap(filterUnavailableAndImportedTokenAssets),
  switchMap((assets) =>
    combineLatest(assets.map((ai) => mapToAssetInfo(ai.id))),
  ),
  map((assets) => assets.filter(Boolean) as AssetInfo[]),
  publishReplay(1),
  refCount(),
);

export const getDefaultAssetsFor = (assetId: string): Observable<AssetInfo[]> =>
  defaultAssets$.pipe(
    switchMap((defaultAssets) => getAssetFor(assetId, defaultAssets)),
    publishReplay(1),
    refCount(),
  );

export const importedAssets$: Observable<AssetInfo[]> = assets$.pipe(
  switchMap(filterUnavailableAndDefaultTokenAssets),
  switchMap((assets) =>
    combineLatest(assets.map((ai) => mapToAssetInfo(ai.id))).pipe(
      defaultIfEmpty([]),
    ),
  ),
  map((assets) => assets.filter(Boolean) as AssetInfo[]),
  publishReplay(1),
  refCount(),
);

export const getImportedAssetsFor = (
  assetId: string,
): Observable<AssetInfo[]> =>
  importedAssets$.pipe(
    switchMap((importedAssets) => getAssetFor(assetId, importedAssets)),
    publishReplay(1),
    refCount(),
  );

export const assetsToImport$ = assets$.pipe(
  switchMap(filterAvailableTokenAssets),
  switchMap((assets) =>
    combineLatest(assets.map((ai) => mapToAssetInfo(ai.id))).pipe(
      defaultIfEmpty([]),
    ),
  ),
  map((assets) => assets.filter(Boolean) as AssetInfo[]),
  publishReplay(1),
  refCount(),
);

export const getAssetsToImportFor = (
  assetId: string,
): Observable<AssetInfo[]> =>
  assetsToImport$.pipe(
    switchMap((assetsToImport) => getAssetFor(assetId, assetsToImport)),
    publishReplay(1),
    refCount(),
  );
