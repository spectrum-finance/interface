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
  icon: `${applicationConfig.networksSettings.ergo.metadataUrl}/${ERGO_ID}.svg`,
  id: ERGO_ID,
  decimals: ERG_DECIMALS,
};

export const spfAsset: AssetInfo = {
  name: 'Spf',
  ticker: 'SPF',
  icon: `${applicationConfig.networksSettings.ergo.metadataUrl}/9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d.svg`,
  id: '9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d',
  decimals: 6,
};

export const feeAsset: AssetInfo = spfAsset;

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);

export const useNetworkAsset = (): [AssetInfo, boolean, Error | undefined] =>
  useObservable(networkAsset$, [], networkAsset);
