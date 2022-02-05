import { from, map, publishReplay, refCount, switchMap, zip } from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { isWalletConnected$ } from '../../../services/new/core';

const getUsedAddresses = () => from(ergo.get_used_addresses());

const getUnusedAddresses = () => from(ergo.get_unused_addresses());

export const addresses$ = isWalletConnected$.pipe(
  switchMap(() => appTick$),
  switchMap(() => zip(getUsedAddresses(), getUnusedAddresses())),
  map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  publishReplay(1),
  refCount(),
);
