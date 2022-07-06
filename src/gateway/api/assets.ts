import uniqBy from 'lodash/uniqBy';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { AssetInfo } from '../../common/models/AssetInfo';
import { ammPools$ } from './ammPools';

export const tokenAssets$ = ammPools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

export const lpAssets$ = ammPools$.pipe(
  map((pools) => pools.map((p) => p.lp.asset)),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

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
