import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { uniqBy } from 'lodash';
import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';
import { ammPools$ } from './ammPools';

export const assets$ = selectedNetwork$.pipe(
  switchMap((network) => network.assets$),
  publishReplay(1),
  refCount(),
);

export const lpAssets$ = selectedNetwork$.pipe(
  switchMap((network) => network.lpAssets$),
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
