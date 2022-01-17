import { uniqBy } from 'lodash';
import { map, publishReplay, refCount } from 'rxjs';

import { pools$ } from '../pools/pools';

export const lpAssets$ = pools$.pipe(
  map((pools) => pools.map((p) => p.lp.asset)),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);
