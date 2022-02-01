import { map, Observable, publishReplay, refCount } from 'rxjs';

import { AssetLock } from '../../../common/models/AssetLock';
import { positions$ } from '../positions/positions';

export const locks$: Observable<AssetLock[]> = positions$.pipe(
  map((positions) => positions.flatMap((p) => p.locks)),
  publishReplay(1),
  refCount(),
);
