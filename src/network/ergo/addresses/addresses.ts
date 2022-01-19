import {
  combineLatest,
  defer,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { isWalletConnected$ } from '../../../services/new/core';

const usedAddresses$ = isWalletConnected$.pipe(
  switchMap(() => defer(() => from(ergo.get_used_addresses()))),
);

const unusedAddresses$ = isWalletConnected$.pipe(
  switchMap(() => defer(() => from(ergo.get_unused_addresses()))),
);

export const addresses$ = combineLatest([
  usedAddresses$,
  unusedAddresses$,
]).pipe(
  map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
  publishReplay(1),
  refCount(),
);
