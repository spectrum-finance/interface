import { AmmDexOperation, AmmOrder } from '@ergolabs/ergo-dex-sdk';
import { Swap } from '@ergolabs/ergo-dex-sdk/build/main/amm/models/ammOrderInfo';
import { AmmOrderStatus } from '@ergolabs/ergo-dex-sdk/build/main/amm/models/operations';
import { DateTime } from 'luxon';

import { Currency } from '../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  SwapOperation,
} from '../../../../common/models/Operation';
import { getAssetNameByMappedId } from '../../../../utils/map';

const mapRawStatusToStatus = (rs: AmmOrderStatus): OperationStatus => {
  switch (rs) {
    case 'executed':
      return OperationStatus.Executed;
    case 'pending':
      return OperationStatus.Pending;
    case 'submitted':
      return OperationStatus.Locked;
    default:
      return OperationStatus.Executed;
  }
};

const mapToSwapOperation = (ammDexOperation: AmmOrder): SwapOperation => {
  const order: Swap = ammDexOperation.order as any;

  return {
    txId: ammDexOperation.txId,
    type: 'swap',
    status: mapRawStatusToStatus(ammDexOperation.status),
    base: new Currency(0n, order.from.asset),
    quote: new Currency(
      0n,
      order.to.name
        ? order.to
        : {
            id: order.to.id,
            name: getAssetNameByMappedId(order.to.id),
          },
    ),
    id: ammDexOperation.txId,
    dateTime: DateTime.fromMillis(Number(ammDexOperation.timestamp)),
  };
};

// const mapToDepositOperation = (
//   ammDexOperation: AmmOrder,
// ): Observable<OtherOperation> => {
//   const order: Deposit = ammDexOperation.order as any;
//
//   return combineLatest([
//     mapAssetClassToAssetInfo(order.inX.asset),
//     mapAssetClassToAssetInfo(order.inY.asset),
//   ]).pipe(
//     map(([xAsset, yAsset]) => ({
//       id: ammDexOperation.txHash,
//       txId: ammDexOperation.txHash,
//       dateTime: DateTime.local(),
//       type: 'deposit',
//       status: ammDexOperation.status as OperationStatus,
//       x: new Currency(BigInt(order.inX.amount), xAsset),
//       y: new Currency(BigInt(order.inY.amount), yAsset),
//     })),
//   );
// };

export const mapToOperationOrEmpty = (
  ammDexOperation: AmmDexOperation,
): Operation | undefined => {
  if (ammDexOperation.type !== 'order') {
    return undefined;
  }

  switch (ammDexOperation.order.type) {
    case 'swap':
      return mapToSwapOperation(ammDexOperation);
    // case 'deposit':
    //   return mapToDepositOperation(ammDexOperation);
    default:
      return undefined;
  }
};
