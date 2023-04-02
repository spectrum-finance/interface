import {
  AmmDexOperation,
  AmmOrder,
} from '@ergolabs/cardano-dex-sdk/build/main/amm/models/operations';
import {
  Deposit,
  Redeem,
  Swap,
} from '@ergolabs/cardano-dex-sdk/build/main/amm/models/orderInfo';
import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { DateTime } from 'luxon';
import { catchError, combineLatest, first, map, Observable, of } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  OtherOperation,
  SwapOperation,
} from '../../../../common/models/Operation';
import { ammPools$ } from '../ammPools/ammPools';
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
      dateTime: DateTime.fromMillis(ammDexOperation.timestamp),
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
      dateTime: DateTime.fromMillis(ammDexOperation.timestamp),
      type: 'deposit',
      status: ammDexOperation.status as OperationStatus,
      x: new Currency(BigInt(order.inX.amount), xAsset),
      y: new Currency(BigInt(order.inY.amount), yAsset),
    })),
  );
};

const mapToRedeemOperation = (
  ammDexOperation: AmmOrder,
): Observable<OtherOperation | undefined> => {
  const order: Redeem = ammDexOperation.order as any;

  return ammPools$.pipe(
    first(),
    map(
      (ammPools) =>
        ammPools.find(
          (p) =>
            p.lp.asset.id ===
            mkSubject({
              policyId: order.inLq.asset.policyId,
              name: order.inLq.asset.name,
            }),
        )!,
    ),
    map((ammPool) => [ammPool.x.asset, ammPool.y.asset]),
    map(([xAsset, yAsset]) => ({
      id: ammDexOperation.txHash,
      txId: ammDexOperation.txHash,
      dateTime: DateTime.fromMillis(ammDexOperation.timestamp),
      type: 'redeem',
      status: ammDexOperation.status as OperationStatus,
      x: new Currency(0n, xAsset),
      y: new Currency(0n, yAsset),
    })),
    catchError(() => of(undefined)),
  ) as Observable<OtherOperation | undefined>;
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
