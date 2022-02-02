import { uniqBy } from 'lodash';
import { map, publishReplay, refCount } from 'rxjs';

import { ammPools$ } from '../ammPools/ammPools';

export const assets$ = ammPools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);
