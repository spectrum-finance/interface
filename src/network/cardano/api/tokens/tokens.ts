import { AssetInfo } from '@ergolabs/ergo-sdk';
import uniqBy from 'lodash/uniqBy';
import { map, of, publishReplay, refCount } from 'rxjs';

import { ammPools$ } from '../ammPools/ammPools';

export const availableTokenAssets$ = ammPools$.pipe(
  map((pools) => pools.flatMap((p) => [p.x.asset, p.y.asset])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

export const tokenAssetsToImport$ = of([]);

export const importTokenAsset = (ai: AssetInfo | AssetInfo[]) => {};
