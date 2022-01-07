import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { find, uniqBy } from 'lodash';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { pools$ } from './pools';

export const assets$ = pools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

export const getAssetById = (id: string): Observable<AssetInfo> =>
  assets$.pipe(map((assets) => find(assets, ['id', id])!));

export const getAvailableAssetFor = (
  assetId: string,
): Observable<AssetInfo[]> =>
  pools$.pipe(
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
