import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';
import { combineLatest, map, Observable } from 'rxjs';

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

export interface RawAddLiquidityOperation {
  readonly address: string;
  readonly poolId: string;
  readonly inputX: TokenAmount;
  readonly inputY: TokenAmount;
}

export interface RawAddLiquidityExecutedOperation
  extends RawBaseExecutedOperation,
    RawAddLiquidityOperation {
  readonly actualX: string;
  readonly actualY: string;
  readonly outputLp: TokenAmount;
}

export type RawAddLiquidityRefundedOperation = RawBaseRefundedOperation &
  RawAddLiquidityOperation;

export type RawAddLiquidityOtherOperation = RawBaseOtherOperation &
  RawAddLiquidityOperation;

export interface RawAddLiquidityItem {
  AmmDepositApi:
    | RawAddLiquidityExecutedOperation
    | RawAddLiquidityRefundedOperation
    | RawAddLiquidityOtherOperation;
}

export interface AddLiquidityOperation {
  readonly address: string;
  readonly poolId: string;
  readonly x: Currency;
  readonly y: Currency;
  readonly type: OperationType.AddLiquidity;
}

export interface AddLiquidityExecutedOperation
  extends BaseExecutedOperation,
    AddLiquidityOperation {
  readonly lp: Currency;
}

export type AddLiquidityRefundedOperation = BaseRefundedOperation &
  AddLiquidityOperation;

export type AddLiquidityOtherOperation = BaseOtherOperation &
  AddLiquidityOperation;

export type AddLiquidityItem =
  | AddLiquidityExecutedOperation
  | AddLiquidityRefundedOperation
  | AddLiquidityOtherOperation;

export const mapRawAddLiquidityItemToAddLiquidityItem = (
  item: RawAddLiquidityItem,
): Observable<AddLiquidityItem> => {
  const { status, address, inputX, inputY, poolId } = item.AmmDepositApi;

  return combineLatest([
    mapToAssetInfo(inputX.tokenId),
    mapToAssetInfo(inputY.tokenId),
  ]).pipe(
    map(([xAsset, yAsset]) => {
      if (status === OperationStatus.Evaluated) {
        return {
          ...mapRawBaseExecutedOperationToBaseExecutedOperation(
            item.AmmDepositApi,
          ),
          address,
          x: new Currency(BigInt(item.AmmDepositApi.actualX), xAsset),
          y: new Currency(BigInt(item.AmmDepositApi.actualY), yAsset),
          lp: new Currency(BigInt(item.AmmDepositApi.outputLp.amount), {
            id: item.AmmDepositApi.outputLp.tokenId,
          }),
          poolId,
          type: OperationType.AddLiquidity,
        };
      }
      if (status === OperationStatus.Refunded) {
        return {
          ...mapRawBaseRefundedOperationToBaseRefundedOperation(
            item.AmmDepositApi,
          ),
          address,
          x: new Currency(BigInt(item.AmmDepositApi.inputX.amount), xAsset),
          y: new Currency(BigInt(item.AmmDepositApi.inputY.amount), yAsset),
          poolId,
          type: OperationType.AddLiquidity,
        };
      }
      return {
        ...mapRawBaseOtherOperationToBaseOtherOperation(item.AmmDepositApi),
        address,
        x: new Currency(BigInt(item.AmmDepositApi.inputX.amount), xAsset),
        y: new Currency(BigInt(item.AmmDepositApi.inputY.amount), yAsset),
        poolId,
        type: OperationType.AddLiquidity,
      };
    }),
  );
};
