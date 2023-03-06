import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  BaseExecutedOperation,
  BaseOtherOperation,
  BaseRefundedOperation,
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationMapper,
  OperationStatus,
  OperationType,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawLmRedeemOperation {
  readonly expectedLq: TokenAmount;
}

export type RawLmRedeemExecutedOperation = RawBaseExecutedOperation &
  RawLmRedeemOperation;

export type RawLmRedeemRefundedOperation = RawBaseRefundedOperation &
  RawLmRedeemOperation;

export type RawLmRedeemOtherOperation = RawBaseOtherOperation &
  RawLmRedeemOperation;

export interface RawLmRedeemItem {
  LmRedeemApi:
    | RawLmRedeemExecutedOperation
    | RawLmRedeemRefundedOperation
    | RawLmRedeemOtherOperation;
}

export interface LmRedeemOperation {
  readonly pool: AmmPool;
  readonly lq: Currency;
  readonly type: OperationType.LmRedeem;
}

export type LmRedeemExecutedOperation = BaseExecutedOperation &
  LmRedeemOperation;

export type LmRedeemRefundedOperation = BaseRefundedOperation &
  LmRedeemOperation;

export type LmRedeemOtherOperation = BaseOtherOperation & LmRedeemOperation;

export type LmRedeemItem =
  | LmRedeemExecutedOperation
  | LmRedeemRefundedOperation
  | LmRedeemOtherOperation;

export const mapRawLmRedeemItemToLmRedeem: OperationMapper<
  RawLmRedeemItem,
  LmRedeemItem
> = (item: RawLmRedeemItem, ammPools: AmmPool[]): LmRedeemItem => {
  const { status, expectedLq } = item.LmRedeemApi;
  const pool = ammPools.find((ap) => ap.lp.asset.id === expectedLq.tokenId)!;

  if (status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item.LmRedeemApi),
      lq: new Currency(BigInt(expectedLq.amount), pool.lp.asset),
      pool,
      type: OperationType.LmRedeem,
    };
  }
  if (status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.LmRedeemApi),
      lq: new Currency(BigInt(expectedLq.amount), pool.lp.asset),
      pool,
      type: OperationType.LmRedeem,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.LmRedeemApi),
    lq: new Currency(BigInt(expectedLq.amount), pool.lp.asset),
    pool,
    type: OperationType.LmRedeem,
  };
};
