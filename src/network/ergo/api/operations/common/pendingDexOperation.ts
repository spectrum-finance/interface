import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk/build/main/amm/models/operations';
import {
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { appTick$ } from '../../../../../common/streams/appTick';
import networkHistory from '../../../../../services/networkHistory';
import { getAddresses } from '../../addresses/addresses';

export const pendingDexOperation$: Observable<AmmDexOperation[]> =
  combineLatest([getAddresses(), appTick$]).pipe(
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
    catchError(() => of([])),
    publishReplay(1),
    refCount(),
  );
