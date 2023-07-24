import { AmmPool } from '../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../common/models/Currency';
import {
  AddLiquidityItem,
  OperationStatus,
  OperationType,
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

export interface RawAddLiquidityOperation {
  readonly address: string;
  readonly poolId: string;
  readonly inputX: AssetAmountDescriptor;
  readonly inputY: AssetAmountDescriptor;
}

export interface RawAddLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawAddLiquidityOperation {
  readonly actualX: string;
  readonly actualY: string;
  readonly outputLp: AssetAmountDescriptor;
}

export type RawAddLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawAddLiquidityOperation;

export type RawAddLiquidityOtherOperation = RawBaseOtherOperation &
  RawAddLiquidityOperation;

export interface RawAddLiquidityItem {
  DepositOrderInfo:
    | RawAddLiquidityExecutedOperation
    | RawAddLiquidityRefundedOperation
    | RawAddLiquidityOtherOperation;
}

export const mapRawAddLiquidityItemToAddLiquidityItem: OperationMapper<
  RawAddLiquidityItem,
  AddLiquidityItem
> = (item: RawAddLiquidityItem, ammPools: AmmPool[]): AddLiquidityItem => {
  const { address, inputX, inputY, poolId } = item.DepositOrderInfo;
  const pool = ammPools.find((ap) => {
    const castedPool: CardanoAmmPool = ap as any;

    return (
      `${castedPool.pool.id.policyId}.${castedPool.pool.id.name}` === poolId
    );
  })!;

  if (item.DepositOrderInfo.status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(
        item.DepositOrderInfo,
      ),
      address,
      x: new Currency(
        BigInt(item.DepositOrderInfo?.actualX || inputX.amount),
        pool.x.asset,
      ),
      y: new Currency(
        BigInt(item.DepositOrderInfo?.actualY || inputY.amount),
        pool.y.asset,
      ),
      lp: new Currency(
        BigInt(item.DepositOrderInfo.outputLp.amount),
        pool.lp.asset,
      ),
      pool,
      type: OperationType.AddLiquidity,
    };
  }
  if (item.DepositOrderInfo.status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(
        item.DepositOrderInfo,
      ),
      address,
      x: new Currency(BigInt(inputX.amount), pool.x.asset),
      y: new Currency(BigInt(inputY.amount), pool.y.asset),
      pool,
      type: OperationType.AddLiquidity,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.DepositOrderInfo),
    address,
    x: new Currency(BigInt(inputX.amount), pool.x.asset),
    y: new Currency(BigInt(inputY.amount), pool.y.asset),
    pool,
    type: OperationType.AddLiquidity,
  };
};

export const getRegisterTxIdFromRawAddLiquidityItem = (
  rawSwapItem: RawAddLiquidityItem,
): TxId => rawSwapItem.DepositOrderInfo.registerTx;
