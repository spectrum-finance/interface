import { map, publishReplay, refCount } from 'rxjs';

import { networkAsset } from '../networkAsset/networkAsset';
import { assetBalance$ } from './assetBalance';

export const networkAssetBalance$ = assetBalance$.pipe(
  map((balance) => balance.get(networkAsset)),
  publishReplay(1),
  refCount(),
);
