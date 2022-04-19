import {
  BehaviorSubject,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  Observable,
  publishReplay,
  refCount,
  zip,
} from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { cardanoNetwork } from '../../network/cardano/cardano';
import { Network } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';

const updateSelectedNetwork$ = new BehaviorSubject<Network<any, any>>(
  ergoNetwork,
);

export const networks = [ergoNetwork, cardanoNetwork];

export const changeSelectedNetwork = (network: Network<any, any>): void =>
  updateSelectedNetwork$.next(network);

export const selectedNetwork$: Observable<Network<any, any>> =
  updateSelectedNetwork$.pipe(
    distinctUntilKeyChanged('name'),
    publishReplay(1),
    refCount(),
  );

export const networksInitialized$ = zip(
  networks.map((n) => n.initialized$),
).pipe(
  map((networksInitialized) => networksInitialized.every(Boolean)),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

export const initializeNetworks = (): void =>
  networks.forEach((n) => n.initialize());

export const useSelectedNetwork = (): [Network<any, any>, boolean, Error] =>
  useObservable(selectedNetwork$, [], ergoNetwork);
