import { user } from '@spectrumlabs/analytics';
import {
  BehaviorSubject,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { localStorageManager } from '../../common/utils/localStorageManager';
import { cardanoMainnet, cardanoPreview } from '../../network/cardano/cardano';
import { Network } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';

const SELECTED_NETWORK_KEY = 'spectrum-selected-network-key';

const updateSelectedNetwork$ = new BehaviorSubject<
  Network<any, any> | undefined
>(undefined);

let afterNetworkChange: ((n: Network<any, any>) => void) | undefined =
  undefined;

export const networks: Network<any, any, any>[] = [
  ergoNetwork,
  cardanoPreview,
  cardanoMainnet,
];

export const isNetworkExists = (networkName?: string): boolean =>
  networks.some((n) => n.name === networkName);

export let selectedNetwork: Network<any, any, any>;

export const changeSelectedNetwork = (network: Network<any, any>): void => {
  localStorageManager.set(SELECTED_NETWORK_KEY, network.name);

  if (afterNetworkChange) {
    afterNetworkChange(network);
  }
};

export const selectedNetwork$: Observable<Network<any, any>> =
  updateSelectedNetwork$.pipe(
    filter(Boolean),
    distinctUntilKeyChanged('name'),
    publishReplay(1),
    refCount(),
  );

interface InitializeNetworkParams {
  readonly possibleName?: string;
  readonly afterNetworkChange?: (network: Network<any, any>) => void;
}
export const initializeNetwork = (
  params: InitializeNetworkParams,
): Network<any, any> => {
  const selectedNetworkName = isNetworkExists(params.possibleName)
    ? params.possibleName
    : localStorageManager.get<string>(SELECTED_NETWORK_KEY);
  const newSelectedNetwork: Network<any, any> = selectedNetworkName
    ? networks.find((n) => n.name === selectedNetworkName) ||
      (ergoNetwork as any)
    : (ergoNetwork as any);

  afterNetworkChange = params.afterNetworkChange;
  selectedNetwork = newSelectedNetwork;
  localStorageManager.set(SELECTED_NETWORK_KEY, newSelectedNetwork.name);
  updateSelectedNetwork$.next(newSelectedNetwork);
  newSelectedNetwork.initialize();

  return newSelectedNetwork;
};

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
