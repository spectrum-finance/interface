import { DateTime } from 'luxon';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { Currency } from '../../../../../common/models/Currency';
import {
  BaseExecutedOperation,
  BaseOtherOperation,
  BaseRefundedOperation,
  OperationStatus,
  Transaction,
} from '../../../../../common/models/OperationV2';
import { TxId } from '../../../../../common/types';
import { networkAsset } from '../../networkAsset/networkAsset';

export interface RawTransaction {
  readonly id: string;
  readonly ts: number;
}

export type OperationMapper<
  T,
  R extends BaseExecutedOperation | BaseRefundedOperation | BaseOtherOperation,
> = (raw: T, ammPools: AmmPool[]) => R;

export interface RawBaseOperation {
  readonly id: TxId;
  readonly registerTx: RawTransaction;
  readonly inMemPool?: boolean;
}

export interface RawBaseExecutedOperation extends RawBaseOperation {
  readonly evaluateTx: RawTransaction;
  readonly status: OperationStatus.Evaluated;
  readonly feeAmount: string;
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

export interface AssetAmountDescriptor {
  readonly amount: number;
  readonly asset: {
    readonly currencySymbol: string;
    readonly tokenName: string;
  };
}

const mapRawTxToTx = (rTx: RawTransaction): Transaction => ({
  id: rTx.id,
  dateTime: DateTime.fromMillis(rTx.ts ? rTx.ts * 1000 : 0),
});

export const mapRawBaseExecutedOperationToBaseExecutedOperation = (
  rawBO: RawBaseExecutedOperation,
): BaseExecutedOperation => {
  return {
    id: rawBO.id,
    registerTx: mapRawTxToTx(rawBO.registerTx),
    status: rawBO.status,
    evaluateTx: mapRawTxToTx(rawBO.evaluateTx),
    fee: BigInt(rawBO.feeAmount)
      ? [
          {
            caption: 'Execution Fee',
            value: new Currency(BigInt(rawBO.feeAmount), networkAsset),
          },
        ]
      : [],
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
    status:
      rawBO.status === OperationStatus.Pending && !rawBO.inMemPool
        ? OperationStatus.Registered
        : rawBO.inMemPool
        ? OperationStatus.Pending
        : rawBO.status,
  };
};
