import { map, publishReplay, refCount } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { AssetInfo } from '../../common/models/AssetInfo';
import { selectedNetwork, selectedNetwork$ } from '../common/network';

export const networkAsset$ = selectedNetwork$.pipe(
  map((n) => n.networkAsset),
  publishReplay(1),
  refCount(),
);

export const useNetworkAsset = (): [AssetInfo, boolean, Error] =>
  useObservable(networkAsset$, [], selectedNetwork.networkAsset);
