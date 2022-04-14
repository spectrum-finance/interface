import { map, publishReplay, refCount } from 'rxjs';

import { networkAsset } from '../networkAsset/networkAsset';
import { balance$ } from './balance';

export const networkAssetBalance$ = balance$.pipe(
  map((balance) => balance.get(networkAsset)),
  publishReplay(1),
  refCount(),
);
