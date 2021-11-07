import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { uniqBy } from 'lodash';
import { map, publishReplay, refCount } from 'rxjs';

import { pools$ } from './pools';

export const assets$ = pools$.pipe(
  map((pools) => pools.flatMap((p) => [p.assetX, p.assetY])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

export const getAssetsByPairAsset = (pairAssetId: string) =>
  pools$.pipe(
    map((pools) =>
      pools.filter(
        (p) => p.assetX.id === pairAssetId || p.assetY.id === pairAssetId,
      ),
    ),
    map((pools) =>
      pools
        .flatMap((p) => [
          p.assetX.id !== pairAssetId ? p.assetX : undefined,
          p.assetY.id !== pairAssetId ? p.assetY : undefined,
        ])
        .filter<AssetInfo>(Boolean as any),
    ),
    map((assets) => uniqBy(assets, 'id')),
    publishReplay(1),
    refCount(),
  );
