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

export type OperationMapper<
  T,
  R extends
    | BaseExecutedOperation
    | BaseRefundedOperation
    | BaseOtherOperation
    | undefined,
> = (raw: T, ammPools: AmmPool[]) => R;

export interface RawAddress {
  readonly pkh: string;
  readonly skh: string;
}

export interface RawBaseOperation {
  readonly orderId: TxId;
  readonly pendingTxId: TxId;
  readonly pendingTxTimestamp: number;
  readonly inMemPool?: boolean;
}

export interface RawBaseExecutedOperation extends RawBaseOperation {
  readonly evaluatedTxId: TxId;
  readonly evaluatedTxTimestamp: number;
  readonly status: OperationStatus.Evaluated;
  readonly pendingTxFee: number;
  readonly evaluatedTxFee: number;
  readonly batcherFee: number;
}

export interface RawBaseRefundedOperation extends RawBaseOperation {
  readonly evaluatedTxId: TxId;
  readonly evaluatedTxTimestamp: number;
  readonly status: OperationStatus.Refunded;
}

export interface RawBaseOtherOperation extends RawBaseOperation {
  readonly status:
    | OperationStatus.Pending
    | OperationStatus.Queued
    | OperationStatus.NeedRefund;
}

export interface AssetAmountDescriptor {
  readonly amount: string;
  readonly asset: string;
}

const mapRawTxToTx = (txId: TxId, ts: number): Transaction => ({
  id: txId,
  dateTime: DateTime.fromMillis(ts ? ts * 1000 : 0),
});

export const mapRawBaseExecutedOperationToBaseExecutedOperation = (
  rawBO: RawBaseExecutedOperation,
): BaseExecutedOperation => {
  return {
    id: rawBO.orderId,
    registerTx: mapRawTxToTx(rawBO.pendingTxId, rawBO.pendingTxTimestamp),
    status: rawBO.status,
    evaluateTx: mapRawTxToTx(rawBO.evaluatedTxId, rawBO.pendingTxTimestamp),
    fee: (
      [
        rawBO.batcherFee
          ? {
              caption: 'Execution Fee',
              value: new Currency(BigInt(rawBO.batcherFee), networkAsset),
            }
          : undefined,
        rawBO.pendingTxFee
          ? {
              caption: 'Pending Tx Network Fee',
              value: new Currency(BigInt(rawBO.pendingTxFee), networkAsset),
            }
          : undefined,
        rawBO.evaluatedTxFee
          ? {
              caption: 'Evaluated Tx Network Fee',
              value: new Currency(BigInt(rawBO.evaluatedTxFee), networkAsset),
            }
          : undefined,
      ] as any
    ).filter(Boolean),
  };
};

export const mapRawBaseRefundedOperationToBaseRefundedOperation = (
  rawBO: RawBaseRefundedOperation,
): BaseRefundedOperation => {
  return {
    id: rawBO.orderId,
    registerTx: mapRawTxToTx(rawBO.pendingTxId, rawBO.pendingTxTimestamp),
    refundTx: mapRawTxToTx(rawBO.evaluatedTxId, rawBO.pendingTxTimestamp),
    status: rawBO.status,
  };
};

export const mapRawBaseOtherOperationToBaseOtherOperation = (
  rawBO: RawBaseOtherOperation,
): BaseOtherOperation => {
  return {
    id: rawBO.orderId,
    registerTx: mapRawTxToTx(rawBO.pendingTxId, rawBO.pendingTxTimestamp),
    status:
      rawBO.status === OperationStatus.Pending && !rawBO.inMemPool
        ? OperationStatus.Registered
        : rawBO.inMemPool
        ? OperationStatus.Pending
        : rawBO.status,
  };
};
