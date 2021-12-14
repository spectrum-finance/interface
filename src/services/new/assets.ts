import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { find, uniqBy } from 'lodash';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { pools$ } from './pools';

export const assets$ = pools$.pipe(
  map((pools) => pools.flatMap((p) => [p.assetX, p.assetY])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

export const getAssetById = (id: string): Observable<AssetInfo> =>
  assets$.pipe(map((assets) => find(assets, ['id', id])!));

export const getAvailableAssetFor = (assetId: string) =>
  pools$.pipe(
    map((pools) =>
      pools.filter((p) => p.assetX.id === assetId || p.assetY.id === assetId),
    ),
    map((pools) =>
      pools
        .flatMap((p) => [
          p.assetX.id !== assetId ? p.assetX : undefined,
          p.assetY.id !== assetId ? p.assetY : undefined,
        ])
        .filter<AssetInfo>(Boolean as any),
    ),
    map((assets) => uniqBy(assets, 'id')),
    publishReplay(1),
    refCount(),
  );
