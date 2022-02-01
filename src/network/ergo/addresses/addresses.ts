import {
  combineLatest,
  debounceTime,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { appTick$ } from '../../../common/streams/appTick';
import { isWalletConnected$ } from '../../../services/new/core';

const usedAddresses$ = isWalletConnected$.pipe(
  switchMap(() => appTick$),
  switchMap(() => from(ergo.get_used_addresses())),
  publishReplay(1),
  refCount(),
);

const unusedAddresses$ = isWalletConnected$.pipe(
  switchMap(() => appTick$),
  switchMap(() => from(ergo.get_unused_addresses())),
  publishReplay(1),
  refCount(),
);

export const addresses$ = combineLatest([
  usedAddresses$,
  unusedAddresses$,
]).pipe(
  debounceTime(200),
  map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  publishReplay(1),
  refCount(),
);
