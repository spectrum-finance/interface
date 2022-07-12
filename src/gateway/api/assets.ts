import uniqBy from 'lodash/uniqBy';
import {
  first,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../common/models/AssetInfo';
import { selectedNetwork$ } from '../common/network';
import { ammPools$ } from './ammPools';

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

export const importTokenAsset = (ai: AssetInfo): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.importTokenAsset(ai));
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
