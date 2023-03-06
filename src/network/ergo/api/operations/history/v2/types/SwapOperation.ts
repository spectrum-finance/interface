import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';
import { combineLatest, map, Observable } from 'rxjs';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import { mapToAssetInfo } from '../../../../common/assetInfoManager';
import {
  BaseExecutedOperation,
  BaseOtherOperation,
  BaseRefundedOperation,
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationStatus,
  OperationType,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawSwapOperation {
  readonly address: string;
  readonly poolId: string;
  readonly base: TokenAmount;
  readonly minQuote: TokenAmount;
}

export interface RawSwapExecutedOperation
  extends RawBaseExecutedOperation,
    RawSwapOperation {
  readonly quote: bigint;
}

export type RawSwapRefundedOperation = RawBaseRefundedOperation &
  RawSwapOperation;

export type RawSwapOtherOperation = RawBaseOtherOperation & RawSwapOperation;

export interface RawSwapItem {
  Swap:
    | RawSwapRefundedOperation
    | RawSwapExecutedOperation
    | RawSwapOtherOperation;
}

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

export const mapRawSwapItemToSwapItem = (
  item: RawSwapItem,
  ammPools: AmmPool[],
): SwapItem => {
  const { status, address, base, poolId, minQuote } = item.Swap;
  const pool = ammPools.find((ap) => ap.id === poolId)!;
  const baseAsset =
    pool.x.asset.id === base.tokenId ? pool.x.asset : pool.y.asset;
  const quoteAsset =
    pool.x.asset.id === minQuote.tokenId ? pool.x.asset : pool.y.asset;

  if (status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item.Swap),
      address,
      base: new Currency(BigInt(base.amount), baseAsset),
      quote: new Currency(BigInt(item.Swap.quote), quoteAsset),
      pool,
      type: OperationType.Swap,
    };
  }
  if (status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.Swap),
      address,
      base: new Currency(BigInt(base.amount), baseAsset),
      quote: new Currency(BigInt(minQuote.amount), quoteAsset),
      pool,
      type: OperationType.Swap,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.Swap),
    address,
    base: new Currency(BigInt(base.amount), baseAsset),
    quote: new Currency(BigInt(minQuote.amount), quoteAsset),
    pool,
    type: OperationType.Swap,
  };
};
