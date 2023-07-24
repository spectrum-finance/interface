import { AmmPool } from '../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../common/models/Currency';
import {
  OperationStatus,
  OperationType,
  RemoveLiquidityItem,
} from '../../../../../../common/models/OperationV2';
import { TxId } from '../../../../../../common/types';
import { CardanoAmmPool } from '../../../ammPools/CardanoAmmPool';
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
  readonly address: string;
  readonly poolId: string;
  readonly lp: AssetAmountDescriptor;
}

export interface RawRemoveLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawRemoveLiquidityOperation {
  readonly outX: AssetAmountDescriptor;
  readonly outY: AssetAmountDescriptor;
}

export type RawRemoveLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawRemoveLiquidityOperation;

export type RawRemoveLiquidityOtherOperation = RawBaseOtherOperation &
  RawRemoveLiquidityOperation;

export interface RawRemoveLiquidityItem {
  RedeemOrderInfo:
    | RawRemoveLiquidityExecutedOperation
    | RawRemoveLiquidityRefundedOperation
    | RawRemoveLiquidityOtherOperation;
}

export const mapRawRemoveLiquidityItemToRemoveLiquidityItem: OperationMapper<
  RawRemoveLiquidityItem,
  RemoveLiquidityItem
> = (
  item: RawRemoveLiquidityItem,
  ammPools: AmmPool[],
): RemoveLiquidityItem => {
  const { address, poolId, lp } = item.RedeemOrderInfo;
  const pool = ammPools.find((ap) => {
    const castedPool: CardanoAmmPool = ap as any;

    return (
      `${castedPool.pool.id.policyId}.${castedPool.pool.id.name}` === poolId
    );
  })!;

  if (item.RedeemOrderInfo.status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(
        item.RedeemOrderInfo,
      ),
      address,
      x: new Currency(BigInt(item.RedeemOrderInfo.outX.amount), pool.x.asset),
      y: new Currency(BigInt(item.RedeemOrderInfo.outY.amount), pool.y.asset),
      lp: new Currency(BigInt(lp.amount), pool.lp.asset),
      pool,
      type: OperationType.RemoveLiquidity,
    };
  }
  if (item.RedeemOrderInfo.status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(
        item.RedeemOrderInfo,
      ),
      address,
      lp: new Currency(BigInt(lp.amount), pool.lp.asset),
      pool,
      type: OperationType.RemoveLiquidity,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.RedeemOrderInfo),
    address,
    lp: new Currency(BigInt(lp.amount), pool.lp.asset),
    pool,
    type: OperationType.RemoveLiquidity,
  };
};

export const getRegisterTxIdFromRawRemoveLiquidityItem = (
  rawSwapItem: RawRemoveLiquidityItem,
): TxId => rawSwapItem.RedeemOrderInfo.registerTx;
