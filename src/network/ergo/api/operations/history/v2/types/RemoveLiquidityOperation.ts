import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  BaseExecutedOperation,
  BaseOtherOperation,
  BaseRefundedOperation,
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationMapper,
  OperationStatus,
  OperationType,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawRemoveLiquidityOperation {
  readonly address: string;
  readonly poolId: string;
  readonly lp: TokenAmount;
}

export interface RawRemoveLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawRemoveLiquidityOperation {
  readonly outX: TokenAmount;
  readonly outY: TokenAmount;
}

export type RawRemoveLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawRemoveLiquidityOperation;

export type RawRemoveLiquidityOtherOperation = RawBaseOtherOperation &
  RawRemoveLiquidityOperation;

export interface RawRemoveLiquidityItem {
  AmmRedeemApi:
    | RawRemoveLiquidityExecutedOperation
    | RawRemoveLiquidityRefundedOperation
    | RawRemoveLiquidityOtherOperation;
}

export interface RemoveLiquidityOperation {
  readonly address: string;
  readonly pool: AmmPool;
  readonly lp: Currency;
  readonly type: OperationType.RemoveLiquidity;
}

export interface RemoveLiquidityExecutedOperation
  extends BaseExecutedOperation,
    RemoveLiquidityOperation {
  readonly x: Currency;
  readonly y: Currency;
}

export type RemoveLiquidityRefundedOperation = BaseRefundedOperation &
  RemoveLiquidityOperation;

export type RemoveLiquidityOtherOperation = BaseOtherOperation &
  RemoveLiquidityOperation;

export type RemoveLiquidityItem =
  | RemoveLiquidityExecutedOperation
  | RemoveLiquidityRefundedOperation
  | RemoveLiquidityOtherOperation;

export const mapRawRemoveLiquidityItemToRemoveLiquidityItem: OperationMapper<
  RawRemoveLiquidityItem,
  RemoveLiquidityItem
> = (
  item: RawRemoveLiquidityItem,
  ammPools: AmmPool[],
): RemoveLiquidityItem => {
  const { status, address, poolId, lp } = item.AmmRedeemApi;
  const pool = ammPools.find((ap) => ap.id === poolId)!;

  if (status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item.AmmRedeemApi),
      address,
      x: new Currency(BigInt(item.AmmRedeemApi.outX.amount), pool.x.asset),
      y: new Currency(BigInt(item.AmmRedeemApi.outY.amount), pool.y.asset),
      lp: new Currency(BigInt(lp.amount), pool.lp.asset),
      pool,
      type: OperationType.RemoveLiquidity,
    };
  }
  if (status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.AmmRedeemApi),
      address,
      lp: new Currency(BigInt(lp.amount), pool.lp.asset),
      pool,
      type: OperationType.RemoveLiquidity,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.AmmRedeemApi),
    address,
    lp: new Currency(BigInt(lp.amount), pool.lp.asset),
    pool,
    type: OperationType.RemoveLiquidity,
  };
};
