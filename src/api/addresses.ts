import { Address } from '@ergolabs/ergo-sdk';
import { Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { selectedNetwork$ } from '../network/network';

export const addresses$ = selectedNetwork$.pipe(
  switchMap((network) => network.addresses$),
  publishReplay(1),
  refCount(),
);

export const getAddresses = (): Observable<Address[]> =>
  selectedNetwork$.pipe(switchMap((network) => network.getAddresses()));

export const getUsedAddresses = (): Observable<Address[]> =>
  selectedNetwork$.pipe(switchMap((network) => network.getUsedAddresses()));

export const getUnusedAddresses = (): Observable<Address[]> =>
  selectedNetwork$.pipe(switchMap((network) => network.getUnusedAddresses()));
