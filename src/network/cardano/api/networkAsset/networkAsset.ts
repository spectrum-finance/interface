import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { Observable, of, publishReplay, refCount } from 'rxjs';

import { ERG_DECIMALS } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';

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

export const useNetworkAsset = (): [AssetInfo, boolean, Error] =>
  useObservable(networkAsset$, [], networkAsset);
