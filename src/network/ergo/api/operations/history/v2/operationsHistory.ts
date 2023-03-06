import axios from 'axios';
import {
  combineLatest,
  debounceTime,
  first,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { applicationConfig } from '../../../../../../applicationConfig';
import { AmmPool } from '../../../../../../common/models/AmmPool';
import { getAddresses } from '../../../addresses/addresses';
import { allAmmPools$ } from '../../../ammPools/ammPools';
import {
  mapRawAddLiquidityItemToAddLiquidityItem,
  RawAddLiquidityItem,
} from './types/AddLiquidityOperation';
import {
  mapRawLmDepositItemToLmDeposit,
  RawLmDepositItem,
} from './types/LmDepositOperation';
import {
  mapRawLmRedeemItemToLmRedeem,
  RawLmRedeemItem,
} from './types/LmRedeemOperation';
import { OperationItem, RawOperationItem } from './types/OperationItem';
import {
  mapRawRemoveLiquidityItemToRemoveLiquidityItem,
  RawRemoveLiquidityItem,
} from './types/RemoveLiquidityOperation';
import { mapRawSwapItemToSwapItem, RawSwapItem } from './types/SwapOperation';

const isSwapItem = (rawItem: RawOperationItem): rawItem is RawSwapItem =>
  !!(rawItem as any).Swap;

const isAddLiquidityItem = (
  rawItem: RawOperationItem,
): rawItem is RawAddLiquidityItem => !!(rawItem as any).AmmDepositApi;

const isRemoveLiquidityItem = (
  rawItem: RawOperationItem,
): rawItem is RawRemoveLiquidityItem => !!(rawItem as any).AmmRedeemApi;

const isLmDepositItem = (
  rawItem: RawOperationItem,
): rawItem is RawLmDepositItem => !!(rawItem as any).LmDepositApi;

const isLmRedeemItem = (
  rawItem: RawOperationItem,
): rawItem is RawLmRedeemItem => !!(rawItem as any).LmRedeemApi;

const isAvailableOperationItem = (rawItem: RawOperationItem) => {
  return (
    isSwapItem(rawItem) ||
    isAddLiquidityItem(rawItem) ||
    isRemoveLiquidityItem(rawItem) ||
    isLmDepositItem(rawItem) ||
    isLmRedeemItem(rawItem)
  );
};

const mapRawOperationItemToOperationItem = (
  rawOp: RawOperationItem,
  ammPools: AmmPool[],
): OperationItem => {
  if (isSwapItem(rawOp)) {
    return mapRawSwapItemToSwapItem(rawOp, ammPools);
  } else if (isAddLiquidityItem(rawOp)) {
    return mapRawAddLiquidityItemToAddLiquidityItem(rawOp, ammPools);
  } else if (isRemoveLiquidityItem(rawOp)) {
    return mapRawRemoveLiquidityItemToRemoveLiquidityItem(rawOp, ammPools);
  } else if (isLmDepositItem(rawOp)) {
    return mapRawLmDepositItemToLmDeposit(rawOp, ammPools);
  } else {
    return mapRawLmRedeemItemToLmRedeem(rawOp, ammPools);
  }
};

const getMempoolRawOperations = (
  addresses: string[],
): Observable<RawOperationItem[]> =>
  from(
    axios.post(
      `${applicationConfig.networksSettings.ergo.analyticUrl}history/mempool`,
      addresses,
    ),
  ).pipe(map((res) => res.data));

const getRawOperationsHistory = (
  addresses: string[],
  limit: number,
  offset: number,
): Observable<[RawOperationItem[], number]> =>
  from(
    axios.post(
      `${applicationConfig.networksSettings.ergo.analyticUrl}history/order?limit=${limit}&offset=${offset}`,
      { addresses },
    ),
  ).pipe(
    map((res) => [
      res.data.orders.filter(isAvailableOperationItem),
      res.data.total,
    ]),
  );

const getRawOperations = (
  limit: number,
  offset: number,
): Observable<[RawOperationItem[], number]> => {
  return getAddresses().pipe(
    first(),
    switchMap((addresses) =>
      getMempoolRawOperations(addresses).pipe(
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
    tap(console.log, console.log),
    publishReplay(1),
    refCount(),
  );
