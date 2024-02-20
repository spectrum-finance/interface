import { AmmPool } from '../../../../../common/models/AmmPool';
import { Currency } from '../../../../../common/models/Currency';
import {
  OperationStatus,
  OperationType,
  RemoveLiquidityItem,
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

export interface RawRemoveLiquidityOperation {
  readonly orderType: 'cfmmRedeem';
  readonly address: string;
  readonly poolId: string;
  readonly lq: AssetAmountDescriptor;
}

export interface RawRemoveLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawRemoveLiquidityOperation {
  readonly x: AssetAmountDescriptor;
  readonly y: AssetAmountDescriptor;
}

export type RawRemoveLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawRemoveLiquidityOperation;

export type RawRemoveLiquidityOtherOperation = RawBaseOtherOperation &
  RawRemoveLiquidityOperation;

export type RawRemoveLiquidityItem =
  | RawRemoveLiquidityExecutedOperation
  | RawRemoveLiquidityRefundedOperation
  | RawRemoveLiquidityOtherOperation;

export const mapRawRemoveLiquidityItemToRemoveLiquidityItem: OperationMapper<
  RawRemoveLiquidityItem,
  RemoveLiquidityItem | undefined
> = (
  item: RawRemoveLiquidityItem,
  ammPools: AmmPool[],
): RemoveLiquidityItem | undefined => {
  const { address, poolId, lq } = item;
  const pool = ammPools.find((ap) => {
    const castedPool: CardanoAmmPool = ap as any;

    return castedPool.id === poolId;
  })!;

  if (!pool) {
    return undefined;
  }

  if (item.status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item),
      address,
      x: new Currency(BigInt(item.x.amount), pool.x.asset),
      y: new Currency(BigInt(item.y.amount), pool.y.asset),
      lp: new Currency(BigInt(lq.amount), pool.lp.asset),
      pool,
      type: OperationType.RemoveLiquidity,
    };
  }

  const [x, y] = pool.shares(new Currency(BigInt(lq.amount), pool.lp.asset));

  if (item.status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item),
      address,
      lp: new Currency(BigInt(lq.amount), pool.lp.asset),
      x,
      y,
      pool,
      type: OperationType.RemoveLiquidity,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item),
    address,
    lp: new Currency(BigInt(lq.amount), pool.lp.asset),
    x,
    y,
    pool,
    type: OperationType.RemoveLiquidity,
  };
};
