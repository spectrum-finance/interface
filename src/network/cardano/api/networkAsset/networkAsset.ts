import { Observable, of, publishReplay, refCount } from 'rxjs';

import { AssetInfo } from '../../../../common/models/AssetInfo';

const ADA_ID = 'token-ada';
const ADA_DECIMALS = 6;

export const networkAsset = {
  name: 'ADA',
  ticker: 'ADA',
  id: ADA_ID,
  decimals: ADA_DECIMALS,
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);
