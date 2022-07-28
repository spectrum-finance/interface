import { DateTime } from 'luxon';

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
  readonly dateTime?: DateTime;
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
}

export type Operation = SwapOperation | OtherOperation;

export const isSwapOperation = (
  operation: SwapOperation | OtherOperation,
): operation is SwapOperation => operation.type === 'swap';

export const filterOperations = (
  operations: Operation[],
  term: string | undefined,
): Operation[] => {
  if (!term) {
    return operations;
  }
  const normalizedTerm = term.toLowerCase();

  return operations.filter((o) => {
    if (o.id.toLowerCase() === term) {
      return o;
    }
    if (isSwapOperation(o)) {
      return (
        o.quote.asset.name?.toLowerCase().includes(normalizedTerm) ||
        o.base.asset.name?.toLowerCase().includes(normalizedTerm) ||
        `${o.base.asset.name || ''}${o.quote.asset.name || ''}`
          .toLowerCase()
          .includes(normalizedTerm)
      );
    }
    return (
      o.x.asset.name?.toLowerCase().includes(normalizedTerm) ||
      o.y.asset.name?.toLowerCase().includes(normalizedTerm) ||
      `${o.x.asset.name || ''}${o.y.asset.name || ''}`
        .toLowerCase()
        .includes(normalizedTerm)
    );
  });
};
