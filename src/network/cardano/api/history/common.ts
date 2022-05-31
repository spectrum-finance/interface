import {
  AmmDexOperation,
  AmmOrder,
} from '@ergolabs/cardano-dex-sdk/build/main/amm/models/operations';
import { Swap } from '@ergolabs/cardano-dex-sdk/build/main/amm/models/orderInfo';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable, of } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  SwapOperation,
} from '../../../../common/models/Operation';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';

const mapToSwapOperation = (
  ammDexOperation: AmmOrder,
): Observable<SwapOperation> => {
  const order: Swap = ammDexOperation.order as any;

  return combineLatest([
    mapAssetClassToAssetInfo(order.from.asset),
    mapAssetClassToAssetInfo(order.to),
  ]).pipe(
    map(([fromAsset, toAsset]) => ({
      id: ammDexOperation.txHash,
      txId: ammDexOperation.txHash,
      dateTime: DateTime.local(),
      type: 'swap',
      status: ammDexOperation.status as OperationStatus,
      base: new Currency(order.from.amount, fromAsset),
      quote: new Currency(order.toMinAmount, toAsset),
    })),
  );
};

// const mapToOtherOperation = (
//   ammDexOperation: AmmOrder,
// ): Observable<OtherOperation> => {};

export const mapToOperation = (
  ammDexOperation: AmmDexOperation,
): Observable<Operation | undefined> => {
  if (ammDexOperation.type !== 'order') {
    return of(undefined);
  }
  return ammDexOperation.order.type === 'swap'
    ? mapToSwapOperation(ammDexOperation)
    : of(undefined);
};
