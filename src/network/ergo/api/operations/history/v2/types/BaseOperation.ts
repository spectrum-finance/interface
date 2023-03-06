import { t } from '@lingui/macro';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';

import { DEFAULT_MINER_FEE } from '../../../../../../../common/constants/erg';
import { Currency } from '../../../../../../../common/models/Currency';
import { TxId } from '../../../../../../../common/types';
import { feeAsset, networkAsset } from '../../../../networkAsset/networkAsset';

export interface RawTransaction {
  readonly id: string;
  readonly ts: number;
}

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
}

type FeeType = 'spf' | 'erg';

export interface RawBaseOperation {
  readonly id: TxId;
  readonly registerTx: RawTransaction;
}

export interface RawBaseExecutedOperation extends RawBaseOperation {
  readonly evaluateTx: RawTransaction;
  readonly status: OperationStatus.Evaluated;
  readonly feeAmount: string;
  readonly feeType: FeeType;
}

export interface RawBaseRefundedOperation extends RawBaseOperation {
  readonly refundTx: RawTransaction;
  readonly status: OperationStatus.Refunded;
}

export interface RawBaseOtherOperation extends RawBaseOperation {
  readonly status:
    | OperationStatus.Pending
    | OperationStatus.Queued
    | OperationStatus.NeedRefund;
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

const mapRawTxToTx = (rTx: RawTransaction): Transaction => ({
  id: rTx.id,
  dateTime: DateTime.fromMillis(rTx.ts),
});

export const mapRawBaseExecutedOperationToBaseExecutedOperation = (
  rawBO: RawBaseExecutedOperation,
): BaseExecutedOperation => {
  return {
    id: rawBO.id,
    registerTx: mapRawTxToTx(rawBO.registerTx),
    status: rawBO.status,
    evaluateTx: mapRawTxToTx(rawBO.evaluateTx),
    fee: [
      {
        caption: 'Execution Fee',
        value:
          rawBO.feeType === 'spf'
            ? new Currency(BigInt(rawBO.feeAmount), feeAsset)
            : new Currency(BigInt(rawBO.feeAmount), networkAsset),
      },
      {
        caption: t`Miner fee`,
        value: new Currency(DEFAULT_MINER_FEE, networkAsset),
      },
    ],
  };
};

export const mapRawBaseRefundedOperationToBaseRefundedOperation = (
  rawBO: RawBaseRefundedOperation,
): BaseRefundedOperation => {
  return {
    id: rawBO.id,
    registerTx: mapRawTxToTx(rawBO.registerTx),
    refundTx: mapRawTxToTx(rawBO.refundTx),
    status: rawBO.status,
  };
};

export const mapRawBaseOtherOperationToBaseOtherOperation = (
  rawBO: RawBaseOtherOperation,
): BaseOtherOperation => {
  return {
    id: rawBO.id,
    registerTx: mapRawTxToTx(rawBO.registerTx),
    status: rawBO.status,
  };
};
