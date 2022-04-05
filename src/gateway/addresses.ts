import { Address } from '@ergolabs/ergo-sdk';
import {
  Observable,
  publishReplay,
  refCount,
  switchMap,
  switchMapTo,
} from 'rxjs';

import { appTick$ } from '../common/streams/appTick';
import { selectedNetwork$ } from './network';

export const addresses$ = appTick$.pipe(
  switchMapTo(selectedNetwork$),
  switchMap((network) => network.getAddresses()),
  publishReplay(1),
  refCount(),
);

export const getAddresses = (): Observable<Address[] | undefined> =>
  selectedNetwork$.pipe(switchMap((network) => network.getAddresses()));

export const getUsedAddresses = (): Observable<Address[] | undefined> =>
  selectedNetwork$.pipe(switchMap((network) => network.getUsedAddresses()));

export const getUnusedAddresses = (): Observable<Address[] | undefined> =>
  selectedNetwork$.pipe(switchMap((network) => network.getUnusedAddresses()));
