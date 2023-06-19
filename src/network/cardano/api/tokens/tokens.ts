import { AssetInfo } from '@ergolabs/ergo-sdk';
import uniqBy from 'lodash/uniqBy';
import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { ammPools$ } from '../ammPools/ammPools';
import { defaultTokenList$ } from '../common/defaultTokenList';
import { networkAsset } from '../networkAsset/networkAsset';

export const filterUnavailableAndImportedTokenAssets = (
  assets: AssetInfo[],
): Observable<AssetInfo[]> =>
  defaultTokenList$.pipe(
    map((defaultTokenList) =>
      assets.filter(
        (ai) =>
          defaultTokenList.tokensMap.has(ai.id) || networkAsset.id === ai.id,
      ),
    ),
  );

export const defaultTokenAssets$ = ammPools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  switchMap(filterUnavailableAndImportedTokenAssets),
  publishReplay(1),
  refCount(),
);

export const getDefaultAssetsFor = (assetId: string) =>
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
    publishReplay(1),
    refCount(),
  );

export const tokenAssetsToImport$ = of([]);

export const importTokenAsset = () => {};
