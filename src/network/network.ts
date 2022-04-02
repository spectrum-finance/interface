import { BehaviorSubject, Observable } from 'rxjs';

import { Network } from './common/Network';
import { ergoNetwork } from './ergo/ergo';

const updateSelectedNetwork$ = new BehaviorSubject<Network<any>>(ergoNetwork);

export const changeSelectedNetwork = (network: Network<any>): void =>
  updateSelectedNetwork$.next(network);

export const selectedNetwork$: Observable<Network<any>> =
  updateSelectedNetwork$.asObservable();
