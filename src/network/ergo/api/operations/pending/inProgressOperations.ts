import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk/build/main/amm/models/operations';
import { Address } from '@ergolabs/ergo-sdk';
import {
  catchError,
  combineLatest,
  defaultIfEmpty,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Operation } from '../../../../../common/models/Operation';
import { appTick$ } from '../../../../../common/streams/appTick';
import networkHistory from '../../../../../services/networkHistory';
import { getAddresses } from '../../addresses/addresses';
import { mapToOperationOrEmpty } from '../common/mapToOperationOrEmpty';

const getInProgressDexOperationsByAddress = (
  address: Address,
): Observable<AmmDexOperation[]> =>
  from(
    networkHistory.network.getUTxsByAddress(address, {
      limit: 100,
      offset: 0,
    }),
  ).pipe(
    map(([txs]) =>
      txs.map((tx) => networkHistory['parseOp'](tx, false, [address])),
    ),
    map((txs) => txs.filter(Boolean)),
  );

const getInProgressDexOperationsByAddresses = (
  addresses: Address[],
): Observable<AmmDexOperation[]> =>
  combineLatest(addresses.map(getInProgressDexOperationsByAddress)).pipe(
    map((txsByAddress) => txsByAddress.flatMap((txs) => txs)),
  );

export const inProgressOperations$: Observable<Operation[]> = combineLatest([
  getAddresses(),
  appTick$,
]).pipe(
  switchMap(([addresses]) => getInProgressDexOperationsByAddresses(addresses)),
  switchMap((dexOperations) =>
    combineLatest(dexOperations.map(mapToOperationOrEmpty)).pipe(
      defaultIfEmpty([]),
    ),
  ),
  map((operations) => operations.filter(Boolean) as Operation[]),
  catchError(() => of([])),
  publishReplay(1),
  refCount(),
);
