import {
  first,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { AssetInfo } from '../../common/models/AssetInfo';
import { selectedNetwork$ } from '../common/network';
import { ammPools$ } from './ammPools';

export const defaultTokenAssets$ = selectedNetwork$.pipe(
  switchMap((n) => n.defaultAssets$),
  publishReplay(1),
  refCount(),
);

export const importedTokenAssets$ = selectedNetwork$.pipe(
  switchMap((n) => n.importedAssets$),
  publishReplay(1),
  refCount(),
);

export const tokenAssetsToImport$ = selectedNetwork$.pipe(
  switchMap((n) => n.assetsToImport$),
  publishReplay(1),
  refCount(),
);

export const importTokenAsset = (assets: AssetInfo | AssetInfo[]): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.importTokenAsset(assets));
};

export const getDefaultAssetsFor = (assetId: string): Observable<AssetInfo[]> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.getDefaultAssetsFor(assetId)),
    publishReplay(1),
    refCount(),
  );

export const getImportedAssetsFor = (
  assetId: string,
): Observable<AssetInfo[]> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.getImportedAssetsFor(assetId)),
    publishReplay(1),
    refCount(),
  );

export const getAssetToImportFor = (assetId: string): Observable<AssetInfo[]> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.getAssetsToImportFor(assetId)),
    publishReplay(1),
    refCount(),
  );

export const hasAvailablePoolsWith = (ai: AssetInfo): Observable<boolean> =>
  zip([defaultTokenAssets$, importedTokenAssets$, ammPools$]).pipe(
    first(),
    map(([tokenAssets, importedTokenAssets, ammPools]) =>
      ammPools.some(
        (p) =>
          (p.x.asset.id === ai.id &&
            tokenAssets
              .concat(importedTokenAssets)
              .some((t) => t.id === p.y.asset.id)) ||
          (p.y.asset.id === ai.id &&
            tokenAssets
              .concat(importedTokenAssets)
              .some((t) => t.id === p.x.asset.id)),
      ),
    ),
  );
