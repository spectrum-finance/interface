import { AmmDexOperation, AmmOrder } from '@ergolabs/ergo-dex-sdk';
import {
  Deposit,
  Redeem,
  Swap,
} from '@ergolabs/ergo-dex-sdk/build/main/amm/models/ammOrderInfo';
import { AmmOrderStatus } from '@ergolabs/ergo-dex-sdk/build/main/amm/models/operations';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable, of } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  OtherOperation,
  SwapOperation,
} from '../../../../../common/models/Operation';
import { ammPools$ } from '../../ammPools/ammPools';
import { mapToAssetInfo } from '../../common/assetInfoManager';

const mapRawStatusToStatus = (rs: AmmOrderStatus): OperationStatus => {
  switch (rs) {
    case 'executed':
      return OperationStatus.Executed;
    case 'pending':
    case 'inProgress':
      return OperationStatus.Pending;
    case 'submitted':
      return OperationStatus.Locked;
    default:
      return OperationStatus.Executed;
  }
};

const mapToSwapOperation = (
  ammDexOperation: AmmOrder,
): Observable<SwapOperation> => {
  const order: Swap = ammDexOperation.order as Swap;

  return combineLatest([
    mapToAssetInfo(order.from.asset.id),
    mapToAssetInfo(order.to.id),
  ]).pipe(
    map(([fromAsset, toAsset]) => ({
      txId: ammDexOperation.txId,
      type: 'swap',
      status: mapRawStatusToStatus(ammDexOperation.status),
      base: new Currency(order.from.amount, fromAsset),
      quote: new Currency(0n, toAsset),
      id: ammDexOperation.txId,
      orderInput: ammDexOperation.orderInput,
      dateTime: ammDexOperation.timestamp
        ? DateTime.fromMillis(Number(ammDexOperation.timestamp))
        : undefined,
    })),
  );
};

const mapToRedeemOperation = (
  ammDexOperation: AmmOrder,
): Observable<OtherOperation> => {
  const order: Redeem = ammDexOperation.order as Redeem;

  return ammPools$.pipe(
    map(
      (ammPools) =>
        ammPools.find((p) => p.lp.asset.id === order.inLP.asset.id)!,
    ),
    map((pool) => ({
      txId: ammDexOperation.txId,
      type: 'redeem',
      status: mapRawStatusToStatus(ammDexOperation.status),
      x: new Currency(0n, pool.x.asset),
      y: new Currency(0n, pool.y.asset),
      id: ammDexOperation.txId,
      orderInput: ammDexOperation.orderInput,
      dateTime: ammDexOperation.timestamp
        ? DateTime.fromMillis(Number(ammDexOperation.timestamp))
        : undefined,
    })),
  );
};

const mapToDepositOperation = (
  ammDexOperation: AmmOrder,
): Observable<OtherOperation> => {
  const order: Deposit = ammDexOperation.order as Deposit;

  return combineLatest([
    mapToAssetInfo(order.inX.asset.id),
    mapToAssetInfo(order.inY.asset.id),
  ]).pipe(
    map(([xAsset, yAsset]) => ({
      txId: ammDexOperation.txId,
      type: 'deposit',
      status: mapRawStatusToStatus(ammDexOperation.status),
      x: new Currency(order.inX.amount, xAsset),
      y: new Currency(order.inY.amount, yAsset),
      id: ammDexOperation.txId,
      orderInput: ammDexOperation.orderInput,
      dateTime: ammDexOperation.timestamp
        ? DateTime.fromMillis(Number(ammDexOperation.timestamp))
        : undefined,
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
    case 'redeem':
      return mapToRedeemOperation(ammDexOperation);
    default:
      return of(undefined);
  }
};
