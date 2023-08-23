import { DepositParams } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/interpreters/ammTxBuilder/depositAmmTxBuilder';
import { Value } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { useEffect } from 'react';
import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { useSubject } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../../api/operations/common/minExecutorReward';
import { transactionBuilder$ } from '../../api/operations/common/transactionBuilder.ts';
import { CardanoSettings, useSettings } from '../../settings/settings';

export interface ExtendedDepositTxInfo {
  readonly txFee: Currency | undefined;
  readonly exFee: Currency;
  readonly refundableDeposit: Currency;
  readonly x: Currency;
  readonly y: Currency;
  readonly lq: Currency;
  readonly orderBudget: Value;
  readonly orderValue: Value;
}

export const useDepositTxInfo = (
  value: AddLiquidityFormModel,
): [ExtendedDepositTxInfo | undefined, boolean, CardanoSettings] => {
  const settings = useSettings();

  const [depositTxInfo, updateDepositTxInfo, isSwapTxInfoLoading] = useSubject(
    (
      value: AddLiquidityFormModel,
      depositParams?: DepositParams,
    ): Observable<ExtendedDepositTxInfo | undefined> => {
      if (!depositParams) {
        return of(undefined);
      }

      return transactionBuilder$.pipe(
        switchMap((txBuilder) => txBuilder.deposit(depositParams)),
        map(([, , txInfo]) => ({
          ...txInfo,
          txFee: txInfo.txFee
            ? new Currency(txInfo.txFee, networkAsset)
            : undefined,
          exFee: new Currency(txInfo.exFee, networkAsset),
          refundableDeposit: new Currency(
            txInfo.refundableDeposit,
            networkAsset,
          ),
          x: new Currency(txInfo.x.amount, value.xAsset),
          y: new Currency(txInfo.x.amount, value.yAsset),
          lq: new Currency(txInfo.lq.amount, value.pool?.lp.asset),
        })),
        publishReplay(1),
        refCount(),
      );
    },
  );

  useEffect(() => {
    const { x, y, pool } = value;

    if (!pool || !x || !y) {
      updateDepositTxInfo(value);
      return;
    }

    const xAmount = pool.pool.x.withAmount(x.amount);
    const yAmount = pool.pool.y.withAmount(y.amount);

    updateDepositTxInfo(value, {
      x: xAmount as any,
      y: yAmount as any,
      pool: pool.pool as any,
      slippage: settings.slippage,
      txFees: ammTxFeeMapping,
      minExecutorReward: minExecutorReward,
      changeAddress: settings.address!,
      pk: settings.ph!,
    });
  }, [value.x, value.y, value.pool, settings]);

  return [depositTxInfo, isSwapTxInfoLoading, settings];
};
