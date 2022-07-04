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

export const mapToOperationOrEmpty = (
  ammDexOperation: AmmDexOperation,
): Operation | undefined => {
  if (ammDexOperation.type !== 'order') {
    return undefined;
  }

  switch (ammDexOperation.order.type) {
    case 'swap':
      return mapToSwapOperation(ammDexOperation);
    default:
      return undefined;
  }
};
