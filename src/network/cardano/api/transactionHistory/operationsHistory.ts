import { extractPaymentCred } from '@spectrumlabs/cardano-dex-sdk';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import axios from 'axios';
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
  switchMap, tap
} from "rxjs";

import { applicationConfig } from '../../../../applicationConfig';
import { AmmPool } from '../../../../common/models/AmmPool';
import { TxId } from '../../../../common/types';
import { getAddresses } from '../addresses/addresses';
import { allAmmPools$ } from '../ammPools/ammPools';
import { mapRawAddLiquidityItemToAddLiquidityItem } from './types/AddLiquidityOperation';
import { OperationMapper } from './types/BaseOperation';
import { OperationItem, RawOperationItem } from './types/OperationItem';
import { mapRawRemoveLiquidityItemToRemoveLiquidityItem } from './types/RemoveLiquidityOperation';
import { mapRawSwapItemToSwapItem } from './types/SwapOperation';

export interface OperationsHistoryRequestParams {
  readonly txId?: TxId;
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

  return mapKeyToParser.get(key)!(rawOp, ammPools);
};

export const mempoolRawOperations$: Observable<RawOperationItem[]> =
  getAddresses().pipe(
    switchMap((addresses) =>
      interval(applicationConfig.applicationTick).pipe(
        startWith(0),
        mapTo(addresses),
      ),
    ),
    switchMap((addresses) =>
      from(
        axios.post(
          `${applicationConfig.networksSettings.cardano_mainnet.analyticUrl}mempool/order`,
          {
            userPkhs: addresses.map((a) =>
              extractPaymentCred(a, RustModule.CardanoWasm),
            ),
          },
        ),
      ).pipe(catchError(() => of({ data: [] }))),
    ),
    map((res) => res.data),
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
      `${applicationConfig.networksSettings.cardano_mainnet.analyticUrl}history/order?limit=${limit}&offset=${offset}`,
      {
        ...params,
        userPkhs: addresses.map((a) =>
          extractPaymentCred(a, RustModule.CardanoWasm),
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
  combineLatest([getRawOperations(limit, offset), allAmmPools$]).pipe(
    debounceTime(200),
    map(
      ([[rawOperations, total], ammPools]) =>
        [
          rawOperations.map((rawOp) =>
            mapRawOperationItemToOperationItem(rawOp, ammPools),
          ),
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
    map(([[[rawOperation]], ammPools]) => {
      if (!rawOperation) {
        throw new Error('transaction not found error');
      }
      return mapRawOperationItemToOperationItem(rawOperation, ammPools);
    }),
  );

export const pendingOperationsCount$ = mempoolRawOperations$.pipe(
  map((mro) => mro.length),
  publishReplay(1),
  refCount(),
);
