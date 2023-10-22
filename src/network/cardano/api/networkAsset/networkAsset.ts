import { AdaAssetClass } from '@teddyswap/cardano-dex-sdk';
import { Observable, of, publishReplay, refCount } from 'rxjs';

import { useObservable } from '../../../../common/hooks/useObservable';
import { AssetInfo } from '../../../../common/models/AssetInfo';

const ADA_ID = 'token-ada';
const ADA_DECIMALS = 6;

export const networkAsset = {
  name: 'ADA',
  ticker: 'ADA',
  id: ADA_ID,
  decimals: ADA_DECIMALS,
  data: AdaAssetClass,
  icon: '/img/tokens/token-ada.svg',
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);

export const useNetworkAsset = (): [AssetInfo, boolean, Error | undefined] =>
  useObservable(networkAsset$, [], networkAsset);
