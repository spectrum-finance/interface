import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Observable, of, publishReplay, refCount } from 'rxjs';

import { ERG_DECIMALS } from '../../../../common/constants/erg';

export const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

export const networkAsset = {
  name: 'ERG',
  id: ERGO_ID,
  decimals: ERG_DECIMALS,
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);
