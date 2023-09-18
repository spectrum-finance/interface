import { user } from '@spectrumlabs/analytics';
import {
  BehaviorSubject,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { localStorageManager } from '../../common/utils/localStorageManager';
import { cardanoMainnet, cardanoPreview } from '../../network/cardano/cardano';
import { Network } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';

export const SELECTED_NETWORK_KEY = 'spectrum-selected-network-key';

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

export const visibleNetworks: Network<any, any, any>[] = [
  ergoNetwork,
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
  readonly getSelectedNetwork: () => Observable<Network<any, any>>;
}
export const initializeNetwork = (
  params: InitializeNetworkParams,
): Observable<Network<any, any>> => {
  const cachedNetwork = localStorageManager.get<string>(SELECTED_NETWORK_KEY);
  let selectedNetworkName: string | undefined = undefined;

  if (cachedNetwork && isNetworkExists(cachedNetwork)) {
    selectedNetworkName = cachedNetwork;
  }

  let stream: Observable<Network<any, any>>;

  if (selectedNetworkName) {
    stream = of(networks.find((n) => n.name === selectedNetworkName)!);
  } else {
    stream = params.getSelectedNetwork();
  }

  return stream.pipe(
    map((network) => {
      afterNetworkChange = params.afterNetworkChange;
      selectedNetwork = network;
      localStorageManager.set(SELECTED_NETWORK_KEY, network.name);
      updateSelectedNetwork$.next(network);
      network.initialize();

      return network;
    }),
  );
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
