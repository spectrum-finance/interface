import {
  BehaviorSubject,
  defer,
  distinctUntilChanged,
  of,
  publishReplay,
  refCount,
} from 'rxjs';

import { ergoNetwork } from '../../networks/ergo/ergo';
import { Network } from '../../networks/shared';

const networks: Network[] = [];

export const registerNetwork = (network: Network) => networks.push(network);

export const networks$ = defer(() => of(networks)).pipe(
  publishReplay(1),
  refCount(),
);

export const _selectedNetwork$ = new BehaviorSubject<Network>(ergoNetwork);

export const selectedNetwork$ = _selectedNetwork$.pipe(distinctUntilChanged());
selectedNetwork$.subscribe();

export const setNetwork = (network: Network) => _selectedNetwork$.next(network);
