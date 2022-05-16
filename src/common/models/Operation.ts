import { TxId } from '../types';
import { Currency } from './Currency';

export enum OperationStatus {
  Pending = 'pending',
  Executed = 'executed',
  Locked = 'locked',
}

export interface OperationContract<T extends string> {
  readonly id: TxId;
  readonly txId: TxId;
  readonly type: T;
  readonly status: OperationStatus;
}

export interface SwapOperation extends OperationContract<'swap'> {
  readonly base: Currency;
  readonly quote: Currency;
}

export interface OtherOperation
  extends OperationContract<
    'deposit' | 'redeem' | 'lock' | 'relock' | 'widthdrawal' | 'refund'
  > {
  readonly x: Currency;
  readonly y: Currency;
  readonly lp: Currency;
}

export type Operation = SwapOperation | OtherOperation;
