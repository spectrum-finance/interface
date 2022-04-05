import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Observable, of, publishReplay, refCount } from 'rxjs';

import { ERG_DECIMALS } from '../../../../common/constants/erg';

export const ADA_ID = 'token-ada';

export const networkAsset = {
  name: 'ADA',
  id: ADA_ID,
  decimals: ERG_DECIMALS,
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);
