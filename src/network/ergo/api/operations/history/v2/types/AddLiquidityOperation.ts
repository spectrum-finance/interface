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

export interface RawAddLiquidityOperation {
  readonly address: string;
  readonly poolId: string;
  readonly inputX: TokenAmount;
  readonly inputY: TokenAmount;
}

export interface RawAddLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawAddLiquidityOperation {
  readonly actualX: string;
  readonly actualY: string;
  readonly outputLp: TokenAmount;
}

export type RawAddLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawAddLiquidityOperation;

export type RawAddLiquidityOtherOperation = RawBaseOtherOperation &
  RawAddLiquidityOperation;

export interface RawAddLiquidityItem {
  AmmDepositApi:
    | RawAddLiquidityExecutedOperation
    | RawAddLiquidityRefundedOperation
    | RawAddLiquidityOtherOperation;
}

export interface AddLiquidityOperation {
  readonly address: string;
  readonly pool: AmmPool;
  readonly x: Currency;
  readonly y: Currency;
  readonly type: OperationType.AddLiquidity;
}

export interface AddLiquidityExecutedOperation
  extends BaseExecutedOperation,
    AddLiquidityOperation {
  readonly lp: Currency;
}

export type AddLiquidityRefundedOperation = BaseRefundedOperation &
  AddLiquidityOperation;

export type AddLiquidityOtherOperation = BaseOtherOperation &
  AddLiquidityOperation;

export type AddLiquidityItem =
  | AddLiquidityExecutedOperation
  | AddLiquidityRefundedOperation
  | AddLiquidityOtherOperation;

export const mapRawAddLiquidityItemToAddLiquidityItem: OperationMapper<
  RawAddLiquidityItem,
  AddLiquidityItem
> = (item: RawAddLiquidityItem, ammPools: AmmPool[]): AddLiquidityItem => {
  const { status, address, inputX, inputY, poolId } = item.AmmDepositApi;
  const pool = ammPools.find((ap) => ap.id === poolId)!;

  if (status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item.AmmDepositApi),
      address,
      x: new Currency(
        BigInt(item.AmmDepositApi?.actualX || inputX.amount),
        pool.x.asset,
      ),
      y: new Currency(
        BigInt(item.AmmDepositApi?.actualY || inputY.amount),
        pool.y.asset,
      ),
      lp: new Currency(BigInt(item.AmmDepositApi.outputLp.amount), {
        id: item.AmmDepositApi.outputLp.tokenId,
      }),
      pool,
      type: OperationType.AddLiquidity,
    };
  }
  if (status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.AmmDepositApi),
      address,
      x: new Currency(BigInt(inputX.amount), pool.x.asset),
      y: new Currency(BigInt(inputY.amount), pool.y.asset),
      pool,
      type: OperationType.AddLiquidity,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.AmmDepositApi),
    address,
    x: new Currency(BigInt(inputX.amount), pool.x.asset),
    y: new Currency(BigInt(inputY.amount), pool.y.asset),
    pool,
    type: OperationType.AddLiquidity,
  };
};
