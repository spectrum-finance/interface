import {
  AmmDexOperation,
  AmmOrder,
} from '@ergolabs/cardano-dex-sdk/build/main/amm/models/operations';
import {
  Deposit,
  Swap,
} from '@ergolabs/cardano-dex-sdk/build/main/amm/models/orderInfo';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable, of } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  OtherOperation,
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

const mapToDepositOperation = (
  ammDexOperation: AmmOrder,
): Observable<OtherOperation> => {
  const order: Deposit = ammDexOperation.order as any;

  return combineLatest([
    mapAssetClassToAssetInfo(order.inX.asset),
    mapAssetClassToAssetInfo(order.inY.asset),
  ]).pipe(
    map(([xAsset, yAsset]) => ({
      id: ammDexOperation.txHash,
      txId: ammDexOperation.txHash,
      dateTime: DateTime.local(),
      type: 'deposit',
      status: ammDexOperation.status as OperationStatus,
      x: new Currency(BigInt(order.inX.amount), xAsset),
      y: new Currency(BigInt(order.inY.amount), yAsset),
    })),
  );
};

export const mapToOperationOrEmpty = (
  ammDexOperation: AmmDexOperation,
): Observable<Operation | undefined> => {
  if (ammDexOperation.type !== 'order') {
    return of(undefined);
  }

  switch (ammDexOperation.order.type) {
    case 'swap':
      return mapToSwapOperation(ammDexOperation);
    case 'deposit':
      return mapToDepositOperation(ammDexOperation);
    default:
      return of(undefined);
  }
};
