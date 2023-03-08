import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  BaseOtherOperation,
  BaseRefundedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  mapRawSingleBaseExecutedOperationToSingleBaseExecutedOperation,
  OperationMapper,
  OperationStatus,
  OperationType,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
  RawSingleBaseExecutedOperation,
  SingleBaseExecutedOperation,
} from './BaseOperation';

type EvalType = 'ReLock' | 'Withdraw';

export interface RawLockOperation {
  readonly deadline: number;
  readonly asset: TokenAmount;
  readonly evalType?: EvalType;
}

export type RawLockExecutedOperation = RawSingleBaseExecutedOperation &
  RawLockOperation;

export type RawLockRefundedOperation = RawBaseRefundedOperation &
  RawLockOperation;

export type RawLockOtherOperation = RawBaseOtherOperation & RawLockOperation;

export interface RawLockItem {
  Lock:
    | RawLockExecutedOperation
    | RawLockRefundedOperation
    | RawLockOtherOperation;
}

export interface LockOperation {
  readonly pool: AmmPool;
  readonly lp: Currency;
  readonly deadline: number;
  readonly type:
    | OperationType.LockLiquidity
    | OperationType.ReLockLiquidity
    | OperationType.WithdrawLock;
}

export type LockExecutedOperation = SingleBaseExecutedOperation & LockOperation;

export type LockRefundedOperation = BaseRefundedOperation & LockOperation;

export type LockOtherOperation = BaseOtherOperation & LockOperation;

export type LockItem =
  | LockExecutedOperation
  | LockRefundedOperation
  | LockOtherOperation;

const getLockType = (
  evalType: EvalType | undefined,
):
  | OperationType.WithdrawLock
  | OperationType.ReLockLiquidity
  | OperationType.LockLiquidity => {
  if (evalType === 'ReLock') {
    return OperationType.ReLockLiquidity;
  }
  if (evalType === 'Withdraw') {
    return OperationType.WithdrawLock;
  }
  return OperationType.LockLiquidity;
};

export const mapRawLockItemToLockItem: OperationMapper<RawLockItem, LockItem> =
  (item: RawLockItem, ammPools: AmmPool[]): LockItem => {
    const { status, asset, deadline, evalType } = item.Lock;
    const pool = ammPools.find((ap) => ap.lp.asset.id === asset.tokenId)!;

    if (status === OperationStatus.Evaluated) {
      return {
        ...mapRawSingleBaseExecutedOperationToSingleBaseExecutedOperation(
          item.Lock,
        ),
        lp: new Currency(asset.amount, pool.lp.asset),
        deadline,
        pool,
        type: getLockType(evalType),
      };
    }
    if (status === OperationStatus.Refunded) {
      return {
        ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.Lock),
        lp: new Currency(asset.amount, pool.lp.asset),
        deadline,
        pool,
        type: getLockType(evalType),
      };
    }
    return {
      ...mapRawBaseOtherOperationToBaseOtherOperation(item.Lock),
      lp: new Currency(asset.amount, pool.lp.asset),
      deadline,
      pool,
      type: getLockType(evalType),
    };
  };
