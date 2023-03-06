import axios from 'axios';
import {
  combineLatest,
  debounceTime,
  first,
  from,
  map,
  Observable,
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

export const getOperations = (): Observable<OperationItem[]> =>
  getAddresses().pipe(
    first(),
    switchMap((addresses) =>
      combineLatest([
        from(
          axios.post(
            `${applicationConfig.networksSettings.ergo.analyticUrl}history/order?limit=25&offset=25`,
            { addresses },
          ),
        ).pipe(
          tap(console.log),
          map((res) =>
            res.data.orders.filter((order: RawOperationItem) => {
              return (
                isSwapItem(order) ||
                isAddLiquidityItem(order) ||
                isRemoveLiquidityItem(order) ||
                isLmDepositItem(order) ||
                isLmRedeemItem(order)
              );
            }),
          ),
        ),
        allAmmPools$,
      ]),
    ),
    debounceTime(200),
    tap(console.log),
    map(([rawSwaps, ammPools]: [RawOperationItem[], AmmPool[]]) => {
      return rawSwaps.map((rawOp) => {
        console.log(rawOp);
        if (isSwapItem(rawOp)) {
          return mapRawSwapItemToSwapItem(rawOp, ammPools);
        } else if (isAddLiquidityItem(rawOp)) {
          return mapRawAddLiquidityItemToAddLiquidityItem(rawOp, ammPools);
        } else if (isRemoveLiquidityItem(rawOp)) {
          return mapRawRemoveLiquidityItemToRemoveLiquidityItem(
            rawOp,
            ammPools,
          );
        } else if (isLmDepositItem(rawOp)) {
          return mapRawLmDepositItemToLmDeposit(rawOp, ammPools);
        } else {
          return mapRawLmRedeemItemToLmRedeem(rawOp, ammPools);
        }
      });
    }),
    tap(console.log, console.log),
    publishReplay(1),
    refCount(),
  );
