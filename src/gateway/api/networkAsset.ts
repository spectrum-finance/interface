import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { map, publishReplay, refCount } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { ergoNetwork } from '../../network/ergo/ergo';
import { selectedNetwork$ } from '../common/network';

export const networkAsset$ = selectedNetwork$.pipe(
  map((n) => n.networkAsset),
  publishReplay(1),
  refCount(),
);

export const useNetworkAsset = (): [AssetInfo, boolean, Error] =>
  useObservable(networkAsset$, [], ergoNetwork.networkAsset);
