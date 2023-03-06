import axios from 'axios';
import {
  combineLatest,
  debounceTime,
  defaultIfEmpty,
  first,
  from,
  map,
  mapTo,
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
      combineLatest([
        from(
          axios.post(
            `${applicationConfig.networksSettings.ergo.analyticUrl}history/order?limit=25&offset=0`,
            { addresses },
          ),
        ).pipe(
          tap(console.log),
          map((res) =>
            res.data.orders.filter((order: RawOperationItem) => {
              return isSwapItem(order) || isAddLiquidityItem(order);
            }),
          ),
        ),
        allAmmPools$,
      ]),
    ),
    debounceTime(200),
    tap(console.log),
    switchMap(([rawSwaps, ammPools]: [RawOperationItem[], AmmPool[]]) =>
      combineLatest(
        rawSwaps.map((rawOp) => {
          if (isSwapItem(rawOp)) {
            return mapRawSwapItemToSwapItem(rawOp, ammPools);
          } else {
            return mapRawAddLiquidityItemToAddLiquidityItem(rawOp, ammPools);
          }
        }),
      ),
    ),
    publishReplay(1),
    refCount(),
  );
