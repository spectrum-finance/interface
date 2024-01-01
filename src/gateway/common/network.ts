import { user } from '@spectrumlabs/analytics';
import {
  distinctUntilChanged,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { Network } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';

export const networks: Network<any, any, any>[] = [ergoNetwork];

export const isNetworkExists = (networkName?: string): boolean =>
  networks.some((n) => n.name === networkName);

export const selectedNetwork: Network<any, any, any> = ergoNetwork;

export const selectedNetwork$: Observable<Network<any, any>> = of(
  ergoNetwork as any,
);

export const networksInitialized$ = selectedNetwork$.pipe(
  switchMap((n) => {
    user.set('network_active', n.name);
    return n.initialized$;
  }),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

export const useSelectedNetwork = (): [Network<any, any>, boolean, Error] =>
  useObservable(selectedNetwork$, [], selectedNetwork);
