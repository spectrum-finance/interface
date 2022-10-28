import { AugErgoBox } from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';

import { TxId } from '../types';
import { Currency } from './Currency';

export enum OperationStatus {
  Pending = 'pending',
  Executed = 'executed',
  Queued = 'queued',
  Locked = 'locked',
}

export interface OperationContract<T extends string> {
  readonly id: TxId;
  readonly txId: TxId;
  readonly type: T;
  readonly dateTime?: DateTime;
  readonly status: OperationStatus;
  readonly orderInput?: AugErgoBox;
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
        o.quote.asset.ticker?.toLowerCase().includes(normalizedTerm) ||
        o.base.asset.ticker?.toLowerCase().includes(normalizedTerm) ||
        `${o.base.asset.ticker || ''}${o.quote.asset.ticker || ''}`
          .toLowerCase()
          .includes(normalizedTerm)
      );
    }
    return (
      o.x.asset.ticker?.toLowerCase().includes(normalizedTerm) ||
      o.y.asset.ticker?.toLowerCase().includes(normalizedTerm) ||
      `${o.x.asset.ticker || ''}${o.y.asset.ticker || ''}`
        .toLowerCase()
        .includes(normalizedTerm)
    );
  });
};
