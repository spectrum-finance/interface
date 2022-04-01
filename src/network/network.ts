import { BehaviorSubject, Observable } from 'rxjs';

import { Network } from './common';
import { ergoNetwork } from './ergo';

const updateSelectedNetwork$ = new BehaviorSubject<Network>(ergoNetwork);

export const changeSelectedNetwork = (network: Network): void =>
  updateSelectedNetwork$.next(network);

export const selectedNetwork$: Observable<Network> =
  updateSelectedNetwork$.asObservable();
