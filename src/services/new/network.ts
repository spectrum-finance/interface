import { BehaviorSubject, defer, of, publishReplay, refCount } from 'rxjs';

import { ergoNetwork } from '../../networks/ergo/ergo';
import { Network } from '../../networks/shared';

const networks: Network[] = [];

export const registerNetwork = (network: Network) => networks.push(network);

export const networks$ = defer(() => of(networks)).pipe(
  publishReplay(1),
  refCount(),
);

export const selectedNetwork$ = new BehaviorSubject<Network>(ergoNetwork);

export const setNetwork = (network: Network) => selectedNetwork$.next(network);
