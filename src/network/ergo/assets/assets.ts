import { uniqBy } from 'lodash';
import { map, publishReplay, refCount } from 'rxjs';

import { pools$ } from '../pools/pools';

export const assets$ = pools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);
