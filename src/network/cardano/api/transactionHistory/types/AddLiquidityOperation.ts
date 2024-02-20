import { AmmPool } from '../../../../../common/models/AmmPool';
import { Currency } from '../../../../../common/models/Currency';
import {
  AddLiquidityItem,
  OperationStatus,
  OperationType,
} from '../../../../../common/models/OperationV2';
import { CardanoAmmPool } from '../../ammPools/CardanoAmmPool';
import {
  AssetAmountDescriptor,
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationMapper,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawAddLiquidityOperation {
  readonly orderType: 'cfmmDeposit';
  readonly address: string;
  readonly poolId: string;
  readonly x: AssetAmountDescriptor;
  readonly y: AssetAmountDescriptor;
}

export interface RawAddLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawAddLiquidityOperation {
  readonly actualX: string;
  readonly actualY: string;
  readonly lq: AssetAmountDescriptor;
}

export type RawAddLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawAddLiquidityOperation;

export type RawAddLiquidityOtherOperation = RawBaseOtherOperation &
  RawAddLiquidityOperation;

export type RawAddLiquidityItem =
  | RawAddLiquidityExecutedOperation
  | RawAddLiquidityRefundedOperation
  | RawAddLiquidityOtherOperation;

export const mapRawAddLiquidityItemToAddLiquidityItem: OperationMapper<
  RawAddLiquidityItem,
  AddLiquidityItem | undefined
> = (
  item: RawAddLiquidityItem,
  ammPools: AmmPool[],
): AddLiquidityItem | undefined => {
  const { address, x, y, poolId } = item;
  const pool = ammPools.find((ap) => {
    const castedPool: CardanoAmmPool = ap as any;

    return castedPool.id === poolId;
  });

  if (!pool) {
    return undefined;
  }

  if (item.status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item),
      address,
      x: new Currency(BigInt(item?.actualX || x.amount), pool.x.asset),
      y: new Currency(BigInt(item?.actualY || y.amount), pool.y.asset),
      lp: new Currency(BigInt(item.lq.amount), pool.lp.asset),
      pool,
      type: OperationType.AddLiquidity,
    };
  }
  if (item.status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item),
      address,
      x: new Currency(BigInt(x.amount), pool.x.asset),
      y: new Currency(BigInt(y.amount), pool.y.asset),
      pool,
      type: OperationType.AddLiquidity,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item),
    address,
    x: new Currency(BigInt(x.amount), pool.x.asset),
    y: new Currency(BigInt(y.amount), pool.y.asset),
    pool,
    type: OperationType.AddLiquidity,
  };
};
