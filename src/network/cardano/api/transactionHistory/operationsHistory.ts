import { extractPaymentCred } from '@teddyswap/cardano-dex-sdk';
import { RustModule } from '@teddyswap/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
import uniq from 'lodash/uniq';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilKeyChanged,
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
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { getAddresses } from '../addresses/addresses';
import { allAmmPools$, fetchVerifiedPoolIds } from '../ammPools/ammPools';
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
  ['SwapOrderInfo', mapRawSwapItemToSwapItem],
  ['DepositOrderInfo', mapRawAddLiquidityItemToAddLiquidityItem],
  ['RedeemOrderInfo', mapRawRemoveLiquidityItemToRemoveLiquidityItem],
]);

const mapRawOperationItemToOperationItem = (
  rawOp: RawOperationItem,
  ammPools: AmmPool[],
): OperationItem => {
  const key = Object.keys(rawOp)[0];
  const result = mapKeyToParser.get(key)!(rawOp, ammPools);
  return result;
};

export const mempoolRawOperations$: Observable<RawOperationItem[]> =
  getAddresses().pipe(
    switchMap((addresses) =>
      interval(1_000).pipe(startWith(0), mapTo(addresses)),
    ),
    switchMap((addresses) =>
      from(
        axios.post(`${cardanoNetworkData.analyticUrl}mempool/order`, {
          userPkhs: uniq(
            addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
          ),
        }),
      ).pipe(catchError(() => of({ data: [] }))),
    ),
    map((res) => res.data),
    map((data) =>
      data.map((item) => ({
        [Object.keys(item)[0]]: {
          ...(Object.values(item)[0] as any),
          inMemPool: true,
        },
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
  params: OperationsHistoryRequestParams = {},
): Observable<[RawOperationItem[], number]> =>
  from(
    axios.post<{ orders: RawOperationItem[]; total: number }>(
      `${cardanoNetworkData.analyticUrl}history/order/v2?limit=${limit}&offset=${offset}`,
      {
        ...params,
        userPkhs: uniq(
          addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
        ),
      },
    ),
  ).pipe(
    map(
      (res) =>
        [res.data.orders, res.data.total] as [RawOperationItem[], number],
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

export const getOperations = (
  limit: number,
  offset: number,
): Observable<[OperationItem[], number]> =>
  combineLatest([
    getRawOperations(limit, offset),
    allAmmPools$,
    fetchVerifiedPoolIds(),
  ]).pipe(
    debounceTime(200),
    map(([[rawOperations, total], ammPools, verifiedPoolIds]) => {
      const operations = rawOperations
        .filter((rawOp) =>
          verifiedPoolIds.includes(getPoolIdFromRawOperation(rawOp)),
        )
        .map((rawOp) => mapRawOperationItemToOperationItem(rawOp, ammPools));

      return [operations, total] as [OperationItem[], number];
    }),
    publishReplay(1),
    refCount(),
  );

function getPoolIdFromRawOperation(rawOperation: RawOperationItem) {
  let rawPoolId: string;
  if ('SwapOrderInfo' in rawOperation) {
    rawPoolId = rawOperation.SwapOrderInfo.poolId;
  } else if ('DepositOrderInfo' in rawOperation) {
    rawPoolId = rawOperation.DepositOrderInfo.poolId;
  } else if ('RedeemOrderInfo' in rawOperation) {
    rawPoolId = rawOperation.RedeemOrderInfo.poolId;
  } else {
    return '';
  }

  const [poolIdPart1, poolIdPart2] = rawPoolId.split('.');
  const poolIdPart2Hex = stringToHex(poolIdPart2);
  return `${poolIdPart1}${poolIdPart2Hex}`;
}

const stringToHex = (str: string) =>
  str
    .split('')
    .map((c: any) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

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
  needRefund: number;
  pending: number;
}> = getAddresses().pipe(
  switchMap((addresses) =>
    interval(10_000).pipe(startWith(0), mapTo(addresses)),
  ),
  switchMap((addresses) =>
    from(
      axios.post<{ needRefund: number; pending: number }>(
        `${cardanoNetworkData.analyticUrl}history/order/pending`,
        {
          userPkhs: uniq(
            addresses.map((a) => extractPaymentCred(a, RustModule.CardanoWasm)),
          ),
        },
      ),
    ).pipe(catchError(() => of({ data: { needRefund: 0, pending: 0 } }))),
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
  map((data) => !!data.needRefund || !!data.pending),
  publishReplay(1),
  refCount(),
);
