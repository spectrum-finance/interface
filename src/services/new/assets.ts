import { map, Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from './network';

export const assets$ = selectedNetwork$.pipe(
  switchMap((n) => n.assets$),
  publishReplay(1),
  refCount(),
);

export const getAssetsByPairAsset = (assetPairId: string) =>
  selectedNetwork$.pipe(switchMap((n) => n.getAssetsByPairAsset(assetPairId)));
