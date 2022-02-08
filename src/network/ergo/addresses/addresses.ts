import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { isWalletConnected$ } from '../../../services/new/core';

const getUsedAddresses = () => from(ergo.get_used_addresses());

const getUnusedAddresses = () => from(ergo.get_unused_addresses());

export const getAddresses = (): Observable<string[]> =>
  isWalletConnected$.pipe(
    switchMap(() => zip(getUsedAddresses(), getUnusedAddresses())),
    map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  );

export const addresses$: Observable<string[]> = appTick$.pipe(
  switchMap(() => getAddresses()),
  publishReplay(1),
  refCount(),
);
