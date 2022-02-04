import { uniqBy } from 'lodash';
import { map, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { ammPools$ } from '../ammPools/ammPools';

export const lpAssets$ = ammPools$.pipe(
  map((pools) =>
    pools.filter(
      (p) =>
        !applicationConfig.hiddenAssets.includes(p.x.asset.id) &&
        !applicationConfig.hiddenAssets.includes(p.y.asset.id) &&
        !applicationConfig.blacklistedPools.includes(p.id),
    ),
  ),
  map((pools) => pools.map((p) => p.lp.asset)),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);
