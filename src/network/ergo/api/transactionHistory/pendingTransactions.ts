import {
  combineLatest,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { appTick$ } from '../../../../common/streams/appTick';
import networkHistory from '../../../../services/networkHistory';
import { getAddresses } from '../addresses/addresses';

export const pendingTransactions$ = combineLatest([
  getAddresses(),
  appTick$,
]).pipe(
  switchMap(([addresses]) =>
    combineLatest(
      addresses.map((addr) =>
        from(
          networkHistory.network.getUTxsByAddress(addr, {
            limit: 20,
            offset: 0,
          }),
        ).pipe(
          map(([txs]) =>
            txs.map((tx) => networkHistory['parseOp'](tx, false, [addr])),
          ),
        ),
      ),
    ),
  ),
  map((txsByAddress) => txsByAddress.flatMap((txs) => txs).filter(Boolean)),
  publishReplay(1),
  refCount(),
);
