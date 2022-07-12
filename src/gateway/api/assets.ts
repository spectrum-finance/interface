import uniqBy from 'lodash/uniqBy';
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
import { ammPools$, possibleAmmPools$ } from './ammPools';

// TODO: ADD BLACKLISTED TOKENS FILTER
export const tokenAssets$ = selectedNetwork$.pipe(
  switchMap((n) => n.availableTokenAssets$),
  publishReplay(1),
  refCount(),
);

// TODO: ADD BLACKLISTED TOKENS FILTER
export const tokenAssetsToImport$ = selectedNetwork$.pipe(
  switchMap((n) => n.tokenAssetsToImport$),
  publishReplay(1),
  refCount(),
);

export const importTokenAsset = (assets: AssetInfo | AssetInfo[]): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.importTokenAsset(assets));
};

export const getAvailableAssetFor = (
  assetId: string,
): Observable<AssetInfo[]> =>
  ammPools$.pipe(
    map((pools) =>
      pools.filter((p) => p.x.asset.id === assetId || p.y.asset.id === assetId),
    ),
    map((pools) =>
      pools
        .flatMap((p) => [
          p.x.asset.id !== assetId ? p.x.asset : undefined,
          p.y.asset.id !== assetId ? p.y.asset : undefined,
        ])
        .filter<AssetInfo>(Boolean as any),
    ),
    map((assets) => uniqBy(assets, 'id')),
    publishReplay(1),
    refCount(),
  );

export const getAvailableAssetToImportFor = (
  assetId: string,
): Observable<AssetInfo[]> =>
  possibleAmmPools$.pipe(
    map((pools) =>
      pools.filter((p) => p.x.asset.id === assetId || p.y.asset.id === assetId),
    ),
    map((pools) =>
      pools
        .flatMap((p) => [
          p.x.asset.id !== assetId ? p.x.asset : undefined,
          p.y.asset.id !== assetId ? p.y.asset : undefined,
        ])
        .filter<AssetInfo>(Boolean as any),
    ),
    map((assets) => uniqBy(assets, 'id')),
    publishReplay(1),
    refCount(),
  );

export const hasAvailablePoolsWith = (ai: AssetInfo): Observable<boolean> =>
  zip([tokenAssets$, possibleAmmPools$]).pipe(
    first(),
    map(([tokenAssets, ammPools]) =>
      ammPools.some(
        (p) =>
          (p.x.asset.id === ai.id &&
            tokenAssets.some((t) => t.id === p.y.asset.id)) ||
          (p.y.asset.id === ai.id &&
            tokenAssets.some((t) => t.id === p.x.asset.id)),
      ),
    ),
  );
