import { mkSubject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';

import { AmmPool } from '../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../common/models/Currency';
import {
  OperationStatus,
  OperationType,
  SwapItem,
} from '../../../../../../common/models/OperationV2';
import { TxId } from '../../../../../../common/types';
import { CardanoAmmPool } from '../../../ammPools/CardanoAmmPool';
import {
  AssetAmountDescriptor,
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationMapper,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawSwapOperation {
  readonly address: string;
  readonly poolId: string;
  readonly base: AssetAmountDescriptor;
  readonly minQuote: AssetAmountDescriptor;
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
  SwapOrderInfo:
    | RawSwapRefundedOperation
    | RawSwapExecutedOperation
    | RawSwapOtherOperation;
}

export const mapRawSwapItemToSwapItem: OperationMapper<RawSwapItem, SwapItem> =
  (item: RawSwapItem, ammPools: AmmPool[]): SwapItem => {
    const { address, base, poolId, minQuote } = item.SwapOrderInfo;
    const pool = ammPools.find((ap) => {
      const castedPool: CardanoAmmPool = ap as any;

      return (
        `${castedPool.pool.id.policyId}.${castedPool.pool.id.name}` === poolId
      );
    })!;
    const baseAsset =
      pool.x.asset.id ===
      mkSubject({
        policyId: base.asset.currencySymbol,
        name: base.asset.tokenName,
        nameHex: '',
      })
        ? pool.x.asset
        : pool.y.asset;
    const quoteAsset =
      pool.x.asset.id ===
      mkSubject({
        policyId: minQuote.asset.currencySymbol,
        name: minQuote.asset.tokenName,
        nameHex: '',
      })
        ? pool.x.asset
        : pool.y.asset;

    if (item.SwapOrderInfo.status === OperationStatus.Evaluated) {
      return {
        ...mapRawBaseExecutedOperationToBaseExecutedOperation(
          item.SwapOrderInfo,
        ),
        address,
        base: new Currency(BigInt(base.amount), baseAsset),
        quote: new Currency(BigInt(item.SwapOrderInfo.quote), quoteAsset),
        pool,
        type: OperationType.Swap,
      };
    }
    if (item.SwapOrderInfo.status === OperationStatus.Refunded) {
      return {
        ...mapRawBaseRefundedOperationToBaseRefundedOperation(
          item.SwapOrderInfo,
        ),
        address,
        base: new Currency(BigInt(base.amount), baseAsset),
        quote: new Currency(BigInt(minQuote.amount), quoteAsset),
        pool,
        type: OperationType.Swap,
      };
    }
    return {
      ...mapRawBaseOtherOperationToBaseOtherOperation(item.SwapOrderInfo),
      address,
      base: new Currency(BigInt(base.amount), baseAsset),
      quote: new Currency(BigInt(minQuote.amount), quoteAsset),
      pool,
      type: OperationType.Swap,
    };
  };

export const getRegisterTxIdFromRawSwapItem = (
  rawSwapItem: RawSwapItem,
): TxId => rawSwapItem.SwapOrderInfo.registerTx;
