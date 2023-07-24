import { DateTime } from 'luxon';
import { ReactNode } from 'react';

import { TxId } from '../types';
import { AmmPool } from './AmmPool';
import { Currency } from './Currency';

export enum OperationStatus {
  Queued = 'Queued',
  Pending = 'Pending',
  Evaluated = 'Evaluated',
  NeedRefund = 'NeedRefund',
  Refunded = 'Refunded',
}

export enum OperationType {
  Swap = 'Swap',
  AddLiquidity = 'AddLiquidity',
  RemoveLiquidity = 'RemoveLiquidity',
  LmDeposit = 'LmDeposit',
  LmRedeem = 'LmRedeem',
  LockLiquidity = 'LockLiquidity',
  ReLockLiquidity = 'ReLockLiquidity',
  WithdrawLock = 'WithdrawLock',
}

export interface Transaction {
  readonly id: TxId;
  readonly dateTime: DateTime;
}

export interface Fee {
  readonly caption: ReactNode | ReactNode[] | string;
  readonly value: Currency;
}

export interface BaseOperation {
  readonly id: string;
  readonly registerTx: Transaction;
}

export interface BaseExecutedOperation extends BaseOperation {
  readonly evaluateTx: Transaction;
  readonly status: OperationStatus.Evaluated;
  readonly fee: Fee[];
}

export interface SingleBaseExecutedOperation extends BaseOperation {
  readonly status: OperationStatus.Evaluated;
  readonly fee: Fee[];
}

export interface BaseRefundedOperation extends BaseOperation {
  readonly refundTx: Transaction;
  readonly status: OperationStatus.Refunded;
}

export interface BaseOtherOperation extends BaseOperation {
  readonly status:
    | OperationStatus.Pending
    | OperationStatus.Queued
    | OperationStatus.NeedRefund;
}

/* Add Liquidity */
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

/* Swap */
export interface SwapOperation {
  readonly address: string;
  readonly pool: AmmPool;
  readonly base: Currency;
  readonly quote: Currency;
  readonly type: OperationType.Swap;
}

export type SwapExecutedOperation = BaseExecutedOperation & SwapOperation;

export type SwapRefundedOperation = BaseRefundedOperation & SwapOperation;

export type SwapOtherOperation = BaseOtherOperation & SwapOperation;

export type SwapItem =
  | SwapRefundedOperation
  | SwapExecutedOperation
  | SwapOtherOperation;

/* Redeem */

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
