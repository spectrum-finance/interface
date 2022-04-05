import { BehaviorSubject, Observable } from 'rxjs';

import { useObservable } from '../../common/hooks/useObservable';
import { cardanoNetwork } from '../../network/cardano/cardano';
import { Network } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';

const updateSelectedNetwork$ = new BehaviorSubject<Network<any>>(ergoNetwork);

export const networks = [ergoNetwork, cardanoNetwork];

export const changeSelectedNetwork = (network: Network<any>): void =>
  updateSelectedNetwork$.next(network);

export const selectedNetwork$: Observable<Network<any>> =
  updateSelectedNetwork$.asObservable();

export const useSelectedNetwork = (): [Network<any>, boolean, Error] =>
  useObservable(selectedNetwork$, [], ergoNetwork);
