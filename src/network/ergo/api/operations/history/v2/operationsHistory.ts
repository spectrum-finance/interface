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
import { OperationItem } from './types/OperationItem';
import {
  mapRawSwapItemToSwapItem,
  RawSwapItem,
  SwapItem,
} from './types/SwapOperation';

const isSwapItem = (rawItem: any): rawItem is SwapItem => !!rawItem.Swap;

export const getOperations = (): Observable<OperationItem[]> =>
  getAddresses().pipe(
    first(),
    switchMap((addresses) =>
      axios.post(
        `${applicationConfig.networksSettings.ergo.analyticUrl}history/order?limit=50&offset=0`,
        { addresses },
      ),
    ),
    map((res) => res.data.orders.filter(isSwapItem)),
    switchMap((rawSwaps: RawSwapItem[]) =>
      combineLatest(rawSwaps.map(mapRawSwapItemToSwapItem)),
    ),
    publishReplay(1),
    refCount(),
  );
