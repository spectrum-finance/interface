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
    map((pools) => pools.flatMap((p) => [p.assetX, p.assetY])),
    map((assets) => uniqBy(assets, 'id')),
    publishReplay(1),
    refCount(),
  );
