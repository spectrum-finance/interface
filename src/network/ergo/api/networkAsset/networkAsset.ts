import { Observable, of, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { ERG_DECIMALS } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AssetInfo } from '../../../../common/models/AssetInfo';

export const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

export const networkAsset: AssetInfo = {
  name: 'Ergo',
  ticker: 'ERG',
  icon: `${applicationConfig.networksSettings.ergo.metadataUrl}/light/${ERGO_ID}.svg`,
  id: ERGO_ID,
  decimals: ERG_DECIMALS,
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);

export const useNetworkAsset = (): [AssetInfo, boolean, Error | undefined] =>
  useObservable(networkAsset$, [], networkAsset);
