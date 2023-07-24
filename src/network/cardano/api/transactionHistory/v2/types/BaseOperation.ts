import { DateTime } from 'luxon';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../common/models/Currency';
import {
  BaseExecutedOperation,
  BaseOtherOperation,
  BaseRefundedOperation,
  OperationStatus,
} from '../../../../../../common/models/OperationV2';
import { TxId } from '../../../../../../common/types';
import { networkAsset } from '../../../networkAsset/networkAsset';

export type OperationMapper<
  T,
  R extends BaseExecutedOperation | BaseRefundedOperation | BaseOtherOperation,
> = (raw: T, ammPools: AmmPool[]) => R;

export interface RawBaseOperation {
  readonly id: TxId;
  readonly registerTx: string;
  readonly registerTs: number;
}

export interface RawBaseExecutedOperation extends RawBaseOperation {
  readonly evaluateTx: string;
  readonly evaluateTs: number;
  readonly status: OperationStatus.Evaluated;
  readonly feeAmount: string;
}

export interface RawBaseRefundedOperation extends RawBaseOperation {
  readonly refundTx: string;
  readonly refundTs: number;
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

export const mapRawBaseExecutedOperationToBaseExecutedOperation = (
  rawBO: RawBaseExecutedOperation,
): BaseExecutedOperation => {
  return {
    id: rawBO.id,
    registerTx: {
      id: rawBO.registerTx,
      dateTime: DateTime.fromMillis(rawBO.registerTs),
    },
    status: rawBO.status,
    evaluateTx: {
      id: rawBO.evaluateTx,
      dateTime: DateTime.fromMillis(rawBO.evaluateTs || 0),
    },
    fee: [
      {
        caption: 'Execution Fee',
        value: new Currency(BigInt(rawBO.feeAmount), networkAsset),
      },
    ],
  };
};

export const mapRawBaseRefundedOperationToBaseRefundedOperation = (
  rawBO: RawBaseRefundedOperation,
): BaseRefundedOperation => {
  return {
    id: rawBO.id,
    registerTx: {
      id: rawBO.registerTx,
      dateTime: DateTime.fromMillis(rawBO.registerTs),
    },
    refundTx: {
      id: rawBO.refundTx,
      dateTime: DateTime.fromMillis(rawBO.refundTs || 0),
    },
    status: rawBO.status,
  };
};

export const mapRawBaseOtherOperationToBaseOtherOperation = (
  rawBO: RawBaseOtherOperation,
): BaseOtherOperation => {
  return {
    id: rawBO.id,
    registerTx: {
      id: rawBO.registerTx,
      dateTime: DateTime.fromMillis(rawBO.registerTs),
    },
    status: rawBO.status,
  };
};
