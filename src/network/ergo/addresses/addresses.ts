import {
  filter,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  zip,
} from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { WalletState } from '../../common';
import { selectedWalletState$ } from '../wallets';

const getUsedAddresses = () => from(ergo.get_used_addresses());

const getUnusedAddresses = () => from(ergo.get_unused_addresses());

export const getAddresses = (): Observable<string[]> =>
  selectedWalletState$.pipe(
    filter((state) => state === WalletState.CONNECTED),
    switchMap(() => zip(getUsedAddresses(), getUnusedAddresses())),
    map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  );

export const addresses$: Observable<string[]> = appTick$.pipe(
  switchMap(() => getAddresses()),
  publishReplay(1),
  refCount(),
);
