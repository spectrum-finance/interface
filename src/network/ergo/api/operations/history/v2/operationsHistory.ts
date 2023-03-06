import axios from 'axios';
import {
  combineLatest,
  defaultIfEmpty,
  first,
  map,
  mapTo,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { applicationConfig } from '../../../../../../applicationConfig';
import { getAddresses } from '../../../addresses/addresses';
import {
  mapRawAddLiquidityItemToAddLiquidityItem,
  RawAddLiquidityItem,
} from './types/AddLiquidityOperation';
import { OperationItem, RawOperationItem } from './types/OperationItem';
import {
  mapRawSwapItemToSwapItem,
  RawSwapItem,
  SwapItem,
} from './types/SwapOperation';

const isSwapItem = (rawItem: RawOperationItem): rawItem is RawSwapItem =>
  !!(rawItem as any).Swap;

const isAddLiquidityItem = (
  rawItem: RawOperationItem,
): rawItem is RawAddLiquidityItem => !!(rawItem as any).AmmDepositApi;

export const getOperations = (): Observable<OperationItem[]> =>
  getAddresses().pipe(
    first(),
    switchMap((addresses) =>
      axios.post(
        `${applicationConfig.networksSettings.ergo.analyticUrl}history/order?limit=50&offset=0`,
        { addresses },
      ),
    ),
    tap(console.log),
    map((res) =>
      res.data.orders.filter((order: RawOperationItem) => {
        return isSwapItem(order) || isAddLiquidityItem(order);
      }),
    ),
    switchMap((rawSwaps: RawOperationItem[]) =>
      combineLatest(
        rawSwaps.map((rawOp) => {
          if (isSwapItem(rawOp)) {
            return mapRawSwapItemToSwapItem(rawOp);
          } else {
            return mapRawAddLiquidityItemToAddLiquidityItem(rawOp);
          }
        }),
      ),
    ),
    publishReplay(1),
    refCount(),
  );
