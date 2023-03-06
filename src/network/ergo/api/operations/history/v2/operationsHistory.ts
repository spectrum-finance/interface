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
import { mapRawAddLiquidityItemToAddLiquidityItem } from './types/AddLiquidityOperation';
import { OperationMapper } from './types/BaseOperation';
import { mapRawLmDepositItemToLmDeposit } from './types/LmDepositOperation';
import { mapRawLmRedeemItemToLmRedeem } from './types/LmRedeemOperation';
import { mapRawLockItemToLockItem } from './types/LockOperation';
import { OperationItem, RawOperationItem } from './types/OperationItem';
import { mapRawRemoveLiquidityItemToRemoveLiquidityItem } from './types/RemoveLiquidityOperation';
import { mapRawSwapItemToSwapItem } from './types/SwapOperation';

const mapKeyToParser = new Map<string, OperationMapper<any, any>>([
  ['Swap', mapRawSwapItemToSwapItem],
  ['AmmDepositApi', mapRawAddLiquidityItemToAddLiquidityItem],
  ['AmmRedeemApi', mapRawRemoveLiquidityItemToRemoveLiquidityItem],
  ['LmDepositApi', mapRawLmDepositItemToLmDeposit],
  ['LmRedeemApi', mapRawLmRedeemItemToLmRedeem],
  ['Lock', mapRawLockItemToLockItem],
]);

const mapRawOperationItemToOperationItem = (
  rawOp: RawOperationItem,
  ammPools: AmmPool[],
): OperationItem => {
  const key = Object.keys(rawOp)[0];

  return mapKeyToParser.get(key)!(rawOp, ammPools);
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
    tap(console.log, console.log),
    map((res) => [res.data.orders, res.data.total]),
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
