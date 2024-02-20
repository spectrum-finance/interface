import { AmmPool } from '../../../../../common/models/AmmPool';
import { Currency } from '../../../../../common/models/Currency';
import {
  OperationStatus,
  OperationType,
  SwapItem,
} from '../../../../../common/models/OperationV2';
import { CardanoAmmPool } from '../../ammPools/CardanoAmmPool';
import {
  AssetAmountDescriptor,
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationMapper,
  RawAddress,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawSwapOperation {
  readonly address: RawAddress;
  readonly poolId: string;
  readonly base: AssetAmountDescriptor;
  readonly quote: string;
  readonly minQuoteAmount: string;
  readonly orderType: 'cfmmSwap';
}

export interface RawSwapExecutedOperation
  extends RawBaseExecutedOperation,
    RawSwapOperation {
  readonly quoteAmount: string;
}

export type RawSwapRefundedOperation = RawBaseRefundedOperation &
  RawSwapOperation;

export type RawSwapOtherOperation = RawBaseOtherOperation & RawSwapOperation;

export type RawSwapItem =
  | RawSwapRefundedOperation
  | RawSwapExecutedOperation
  | RawSwapOtherOperation;

export const mapRawSwapItemToSwapItem: OperationMapper<
  RawSwapItem,
  SwapItem | undefined
> = (item: RawSwapItem, ammPools: AmmPool[]): SwapItem | undefined => {
  const { base, poolId, quote, minQuoteAmount } = item;
  const pool = ammPools.find((ap) => {
    const castedPool: CardanoAmmPool = ap as any;

    return castedPool.id === poolId;
  })!;

  if (!pool) {
    return undefined;
  }

  const baseAsset =
    `${pool.x.asset.data.policyId}.${pool.x.asset.data.name}` === base.asset
      ? pool.x.asset
      : pool.y.asset;
  const quoteAsset =
    `${pool.x.asset.data.policyId}.${pool.x.asset.data.name}` === quote
      ? pool.x.asset
      : pool.y.asset;

  if (item.status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item),
      address: '',
      base: new Currency(BigInt(base.amount), baseAsset),
      quote: new Currency(BigInt(item.quoteAmount), quoteAsset),
      pool,
      type: OperationType.Swap,
    };
  }
  if (item.status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item),
      address: '',
      base: new Currency(BigInt(base.amount), baseAsset),
      quote: new Currency(BigInt(minQuoteAmount), quoteAsset),
      pool,
      type: OperationType.Swap,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item),
    address: '',
    base: new Currency(BigInt(base.amount), baseAsset),
    quote: new Currency(BigInt(minQuoteAmount), quoteAsset),
    pool,
    type: OperationType.Swap,
  };
};
