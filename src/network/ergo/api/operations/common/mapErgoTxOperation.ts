import { ErgoTx } from '@ergolabs/ergo-sdk';
import { DateTime } from 'luxon';
import { combineLatest, map, Observable, of } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  OtherOperation,
  SwapOperation,
} from '../../../../../common/models/Operation';
import { parseUserInputToFractions } from '../../../../../utils/math';
import { mapToAssetInfo } from '../../common/assetInfoManager';

export interface SwapAdditionalParams {
  readonly baseId: string;
  readonly baseAmount: string;
  readonly quoteId: string;
  readonly quoteAmount: string;
  readonly type: 'swap';
  readonly timestamp: number;
}

export interface RefundAdditionalParams {
  readonly type: 'refund';
}

export interface OtherAdditionalParams {
  readonly xId: string;
  readonly xAmount: string;
  readonly yId: string;
  readonly yAmount: string;
  readonly type: 'redeem' | 'deposit';
  readonly timestamp: number;
}

export type AdditionalParams =
  | SwapAdditionalParams
  | OtherAdditionalParams
  | RefundAdditionalParams;

const mapErgoTxToSwapOperation = (
  tx: ErgoTx,
  params: SwapAdditionalParams,
  status: OperationStatus,
): Observable<SwapOperation> =>
  combineLatest([
    mapToAssetInfo(params.baseId),
    mapToAssetInfo(params.quoteId),
  ]).pipe(
    map(([baseAsset, quoteAsset]) => ({
      id: tx.id,
      txId: tx.id,
      base: new Currency(
        parseUserInputToFractions(params.baseAmount, baseAsset?.decimals),
        baseAsset,
      ),
      quote: new Currency(
        parseUserInputToFractions(params.quoteAmount, quoteAsset?.decimals),
        quoteAsset,
      ),
      dateTime: DateTime.fromMillis(params.timestamp),
      type: 'swap',
      status,
    })),
  );

const mapErgoTxToOtherOperation = (
  tx: ErgoTx,
  params: OtherAdditionalParams,
  status: OperationStatus,
): Observable<OtherOperation> =>
  combineLatest([mapToAssetInfo(params.xId), mapToAssetInfo(params.yId)]).pipe(
    map(([xAsset, yAsset]) => ({
      id: tx.id,
      txId: tx.id,
      x: new Currency(
        parseUserInputToFractions(params.xAmount, xAsset?.decimals),
        xAsset,
      ),
      y: new Currency(
        parseUserInputToFractions(params.yAmount, yAsset?.decimals),
        yAsset,
      ),
      dateTime: DateTime.fromMillis(params.timestamp),
      type: params.type,
      status,
    })),
  );

export const mapErgoTxToOperation = (
  tx: ErgoTx,
  params: AdditionalParams,
  status: OperationStatus,
): Observable<Operation | undefined> => {
  switch (params.type) {
    case 'swap':
      return mapErgoTxToSwapOperation(tx, params, status);
    case 'refund':
      return of(undefined);
    default:
      return mapErgoTxToOtherOperation(tx, params, status);
  }
};
