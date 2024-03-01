import { extractPaymentCred } from '@spectrumlabs/cardano-dex-sdk';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import uniq from 'lodash/uniq';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilKeyChanged,
  exhaustMap,
  filter,
  first,
  from,
  interval,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { TxId } from '../../../../common/types';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData.ts';
import { getAddresses } from '../addresses/addresses';
import { allAmmPools$ } from '../ammPools/ammPools';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool.ts';
import { mapRawAddLiquidityItemToAddLiquidityItem } from './types/AddLiquidityOperation';
import { OperationMapper } from './types/BaseOperation';
import { OperationItem, RawOperationItem } from './types/OperationItem';
import { mapRawRemoveLiquidityItemToRemoveLiquidityItem } from './types/RemoveLiquidityOperation';
import { mapRawSwapItemToSwapItem } from './types/SwapOperation';

export interface OperationsHistoryRequestParams {
  readonly txId?: TxId;
  readonly refundOnly?: boolean;
  readonly pendingOnly?: boolean;
}

const mapKeyToParser = new Map<string, OperationMapper<any, any>>([
  ['cfmmSwap', mapRawSwapItemToSwapItem],
  ['cfmmDeposit', mapRawAddLiquidityItemToAddLiquidityItem],
  ['cfmmRedeem', mapRawRemoveLiquidityItemToRemoveLiquidityItem],
]);

const mapRawOperationItemToOperationItem = (
  rawOp: RawOperationItem,
  ammPools: AmmPool[],
): OperationItem => {
  const key = rawOp.orderType;

  return mapKeyToParser.get(key)!(rawOp, ammPools);
};

export const mempoolRawOperations$: Observable<RawOperationItem[]> =
  getAddresses().pipe(
    filter((addresses) => addresses.length > 0),
    switchMap((addresses) =>
      interval(1_000).pipe(startWith(0), mapTo(addresses)),
    ),
    exhaustMap((addresses) =>
      from(
        axios.post(
          `${cardanoNetworkData.analyticUrl}history/mempool`,
          uniq(
            addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
          ),
        ),
      ).pipe(catchError(() => of({ data: [] }))),
    ),
    map((res) => res.data),
    map((data) =>
      data.map((item) => ({
        ...item,
        inMemPool: true,
      })),
    ),
    distinctUntilKeyChanged('length'),
    publishReplay(1),
    refCount(),
  );

const getRawOperationsHistory = (
  addresses: string[],
  limit: number,
  offset: number,
  // @ts-ignore
  params: OperationsHistoryRequestParams = {},
): Observable<[RawOperationItem[], number]> =>
  from(
    axios.post<{ order: RawOperationItem[]; count: number }>(
      `${cardanoNetworkData.analyticUrl}history/order?limit=${limit}&offset=${offset}&entityTypeFilter=AnyCFMMOps`,
      uniq(addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm))),
    ),
  ).pipe(
    map(
      (res) => [res.data.order, res.data.count] as [RawOperationItem[], number],
    ),
    publishReplay(1),
    refCount(),
  );

export const getRawOperations = (
  limit: number,
  offset: number,
  params: OperationsHistoryRequestParams = {},
): Observable<[RawOperationItem[], number]> => {
  return getAddresses().pipe(
    filter((addresses) => !!addresses.length),
    first(),
    switchMap((addresses) =>
      mempoolRawOperations$.pipe(
        switchMap((mempoolRawOperations) => {
          const mempoolRawOperationsToDisplay = mempoolRawOperations.slice(
            offset,
            limit,
          );
          if (mempoolRawOperationsToDisplay.length >= limit) {
            return of([
              mempoolRawOperationsToDisplay,
              mempoolRawOperationsToDisplay.length,
            ] as [RawOperationItem[], number]);
          } else {
            return getRawOperationsHistory(
              addresses,
              limit - mempoolRawOperationsToDisplay.length,
              offset === 0 ? offset : offset - mempoolRawOperations.length,
              params,
            ).pipe(
              map(([rawOperationsHistory, total]) => {
                return [
                  [...mempoolRawOperationsToDisplay, ...rawOperationsHistory],
                  total + mempoolRawOperationsToDisplay.length,
                ] as [RawOperationItem[], number];
              }),
            );
          }
        }),
      ),
    ),
    publishReplay(1),
    refCount(),
  );
};

const isValidRawOperation = (
  rawOp: RawOperationItem,
  ammPools: CardanoAmmPool[],
): boolean => {
  const poolIdForRawOp = Object.values(rawOp)[0].poolId;
  if (!poolIdForRawOp) {
    return true;
  }
  return ammPools.some(
    (ammPool) =>
      `${ammPool.pool.id.policyId}.${ammPool.pool.id.name}` === poolIdForRawOp,
  );
};

export const getOperations = (
  limit: number,
  offset: number,
): Observable<[OperationItem[], number]> =>
  combineLatest([getRawOperations(limit, offset), allAmmPools$]).pipe(
    debounceTime(200),
    map(
      ([[rawOperations, total], ammPools]) =>
        [
          rawOperations
            .filter((rawOp) => isValidRawOperation(rawOp, ammPools))
            .map((rawOp) => mapRawOperationItemToOperationItem(rawOp, ammPools))
            .filter(Boolean),
          total,
        ] as [OperationItem[], number],
    ),
    publishReplay(1),
    refCount(),
  );

export const getOperationByTxId = (
  txId: TxId,
): Observable<OperationItem | undefined> =>
  combineLatest([getRawOperations(1, 0, { txId }), allAmmPools$]).pipe(
    debounceTime(200),
    first(),
    map(([[[rawOperation]], ammPools]) => {
      if (!rawOperation) {
        throw new Error('transaction not found error');
      }
      return mapRawOperationItemToOperationItem(rawOperation, ammPools);
    }),
  );

const registeredOrdersCount$: Observable<{
  liquidityOps: boolean;
  tradeOps: boolean;
}> = getAddresses().pipe(
  filter((addresses) => addresses.length > 0),
  switchMap((addresses) =>
    interval(10_000).pipe(startWith(0), mapTo(addresses)),
  ),
  exhaustMap((addresses) =>
    from(
      axios.post<{
        liquidityOps: boolean;
        tradeOps: boolean;
      }>(
        `${cardanoNetworkData.analyticUrl}history/stuck`,
        uniq(
          addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
        ),
      ),
    ).pipe(
      catchError(() => of({ data: { liquidityOps: false, tradeOps: false } })),
    ),
  ),
  map((res) => res.data),
  publishReplay(1),
  refCount(),
);

export const pendingOperationsCount$ = mempoolRawOperations$.pipe(
  map((rawOperations) => rawOperations.length),
  publishReplay(1),
  refCount(),
);

export const hasNeedRefundOperations$ = registeredOrdersCount$.pipe(
  map((data) => data.liquidityOps || data.tradeOps),
  publishReplay(1),
  refCount(),
);
