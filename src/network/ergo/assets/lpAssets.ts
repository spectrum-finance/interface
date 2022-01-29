import { uniqBy } from 'lodash';
import { map, publishReplay, refCount } from 'rxjs';

import { ammPools$ } from '../ammPools/ammPools';

export const lpAssets$ = ammPools$.pipe(
  map((pools) => pools.map((p) => p.lp.asset)),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);
