import { t } from '@lingui/macro';
import { DateTime } from 'luxon';

import { DEFAULT_MINER_FEE } from '../../../../../../../common/constants/erg';
import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  BaseExecutedOperation,
  BaseOtherOperation,
  BaseRefundedOperation,
  OperationStatus,
  SingleBaseExecutedOperation,
  Transaction,
} from '../../../../../../../common/models/OperationV2';
import { TxId } from '../../../../../../../common/types';
import { feeAsset, networkAsset } from '../../../../networkAsset/networkAsset';

export interface RawTransaction {
  readonly id: string;
  readonly ts: number;
}

export type OperationMapper<
  T,
  R extends
    | BaseExecutedOperation
    | BaseRefundedOperation
    | BaseOtherOperation
    | SingleBaseExecutedOperation,
> = (raw: T, ammPools: AmmPool[]) => R;
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

export interface RawSingleBaseExecutedOperation extends RawBaseOperation {
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
    fee: (rawBO.feeType
      ? [
          {
            caption: 'Honey 🍯',
            value:
              rawBO.feeType === 'spf'
                ? new Currency(BigInt(rawBO.feeAmount), feeAsset)
                : new Currency(BigInt(rawBO.feeAmount), networkAsset),
          },
        ]
      : []
    ).concat({
      caption: t`Miner fee`,
      value: new Currency(DEFAULT_MINER_FEE, networkAsset),
    }),
  };
};

export const mapRawSingleBaseExecutedOperationToSingleBaseExecutedOperation = (
  rawBO: RawSingleBaseExecutedOperation,
): SingleBaseExecutedOperation => {
  return {
    id: rawBO.id,
    registerTx: mapRawTxToTx(rawBO.registerTx),
    status: rawBO.status,
    fee: (rawBO.feeType
      ? [
          {
            caption: 'Honey 🍯',
            value:
              rawBO.feeType === 'spf'
                ? new Currency(BigInt(rawBO.feeAmount), feeAsset)
                : new Currency(BigInt(rawBO.feeAmount), networkAsset),
          },
        ]
      : []
    ).concat({
      caption: t`Miner fee`,
      value: new Currency(DEFAULT_MINER_FEE, networkAsset),
    }),
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
