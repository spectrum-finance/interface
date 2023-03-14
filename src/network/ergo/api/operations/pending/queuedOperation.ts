import { ErgoTx } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  debounceTime,
  first,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import {
  Operation,
  OperationStatus,
  OtherOperation,
  SwapOperation,
} from '../../../../../common/models/Operation';
import { TxId } from '../../../../../common/types';
import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { parseUserInputToFractions } from '../../../../../utils/math';
import { mapToAssetInfo } from '../../common/assetInfoManager';
import { networkContext$ } from '../../networkContext/networkContext';
import { mempoolRawOperations$ } from '../history/v2/operationsHistory';
import { getRegisterTxIdFromRawAddLiquidityItem } from '../history/v2/types/AddLiquidityOperation';
import { getRegisterTxIdFromRawLmDepositItem } from '../history/v2/types/LmDepositOperation';
import { getRegisterTxIdFromRawLmRedeemItem } from '../history/v2/types/LmRedeemOperation';
import { getRegisterTxIdFromRawLockItem } from '../history/v2/types/LockOperation';
import { getRegisterTxIdFromRawRemoveLiquidityItem } from '../history/v2/types/RemoveLiquidityOperation';
import { getRegisterTxIdFromRawSwapItem } from '../history/v2/types/SwapOperation';

const mapKeyToIdSelector = new Map<string, (rawOp: any) => TxId>([
  ['Swap', getRegisterTxIdFromRawSwapItem],
  ['AmmDepositApi', getRegisterTxIdFromRawAddLiquidityItem],
  ['AmmRedeemApi', getRegisterTxIdFromRawRemoveLiquidityItem],
  ['LmDepositApi', getRegisterTxIdFromRawLmDepositItem],
  ['LmRedeemApi', getRegisterTxIdFromRawLmRedeemItem],
  ['Lock', getRegisterTxIdFromRawLockItem],
]);

export interface SwapOperationParams {
  readonly txId: string;
  readonly type: 'swap';
  readonly baseAsset: string;
  readonly baseAmount: string;
  readonly quoteAsset: string;
  readonly quoteAmount: string;
}

export interface OtherOperationParams {
  readonly txId: string;
  readonly type: 'deposit' | 'redeem';
  readonly xAsset: string;
  readonly xAmount: string;
  readonly yAsset: string;
  readonly yAmount: string;
}

export interface RefundOperationParams {
  readonly txId: string;
  readonly type: 'refund';
}

export type OperationParams =
  | SwapOperationParams
  | OtherOperationParams
  | RefundOperationParams;

interface QueuedOperation {
  readonly height: number;
  readonly tx: ErgoTx;
  readonly params: OperationParams;
}

const QUEUED_OPERATION_KEY = 'ergo-queued-operation';

const mapErgoTxToSwapOperation = (
  tx: ErgoTx,
  params: SwapOperationParams,
): Observable<SwapOperation> =>
  combineLatest([
    mapToAssetInfo(params.baseAsset),
    mapToAssetInfo(params.quoteAsset),
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
      dateTime: undefined,
      type: 'swap',
      status: OperationStatus.Queued,
    })),
  );

const mapErgoTxToOtherOperation = (
  tx: ErgoTx,
  params: OtherOperationParams,
): Observable<OtherOperation> =>
  combineLatest([
    mapToAssetInfo(params.xAsset),
    mapToAssetInfo(params.yAsset),
  ]).pipe(
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
      dateTime: undefined,
      type: params.type,
      status: OperationStatus.Queued,
    })),
  );

export const mapErgoTxToOperation = (
  tx: ErgoTx,
  params: OperationParams,
): Observable<Operation | undefined> => {
  switch (params.type) {
    case 'swap':
      return mapErgoTxToSwapOperation(tx, params);
    case 'refund':
      return of(undefined);
    default:
      return mapErgoTxToOtherOperation(tx, params);
  }
};

export const addToQueue = (
  tx: ErgoTx,
  params: OperationParams,
): Observable<undefined> => {
  return networkContext$.pipe(
    first(),
    tap((ctx) => {
      if (params.type === 'refund') {
        return;
      }
      localStorageManager.set<QueuedOperation>(QUEUED_OPERATION_KEY, {
        height: ctx.height,
        tx,
        params,
      });
    }),
    mapTo(undefined),
  );
};

export const queuedOperation$: Observable<Operation | undefined> =
  localStorageManager.getStream<QueuedOperation>(QUEUED_OPERATION_KEY).pipe(
    switchMap((queuedOperation) =>
      queuedOperation
        ? mapErgoTxToOperation(queuedOperation.tx, queuedOperation.params)
        : of(undefined),
    ),
    publishReplay(1),
    refCount(),
  );

combineLatest([mempoolRawOperations$, networkContext$])
  .pipe(debounceTime(200))
  .subscribe(([inProgressOperations, ctx]) => {
    const queuedOperation =
      localStorageManager.get<QueuedOperation>(QUEUED_OPERATION_KEY);

    if (!queuedOperation) {
      return;
    }

    if (
      inProgressOperations.some((o) => {
        const id = mapKeyToIdSelector.get(Object.keys(o)[0])!(o);

        return id === queuedOperation.tx.id;
      }) ||
      ctx.height > queuedOperation.height + 1
    ) {
      localStorageManager.remove(QUEUED_OPERATION_KEY);
    }
  });
