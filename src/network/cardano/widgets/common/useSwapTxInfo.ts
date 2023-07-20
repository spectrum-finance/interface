import { SwapParams } from '@spectrumlabs/cardano-dex-sdk';
import { Value } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { useEffect } from 'react';
import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { useSubject } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel.ts';
import { CardanoAmmPool } from '../../api/ammPools/CardanoAmmPool';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../../api/operations/common/minExecutorReward';
import { transactionBuilder$ } from '../../api/operations/common/transactionBuilder.ts';
import {
  CardanoSettings,
  settings,
  useSettings,
} from '../../settings/settings';

export interface ExtendedSwapTxInfo {
  readonly txFee: Currency | undefined;
  readonly minExFee: Currency;
  readonly maxExFee: Currency;
  readonly refundableDeposit: Currency;
  readonly minOutput: Currency;
  readonly maxOutput: Currency;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly orderBudget: Value;
  readonly orderValue: Value;
}

export const useSwapTxInfo = (
  value,
): [ExtendedSwapTxInfo | undefined, boolean, CardanoSettings] => {
  const { nitro, slippage } = useSettings();

  const [swapTxInfo, updateSwapTxInfo, isSwapTxInfoLoading] = useSubject(
    (
      value: SwapFormModel<CardanoAmmPool>,
      swapParams?: SwapParams,
    ): Observable<ExtendedSwapTxInfo | undefined> => {
      if (!swapParams) {
        return of(undefined);
      }

      return transactionBuilder$.pipe(
        switchMap((txBuilder) => txBuilder.swap(swapParams)),
        map(([, , txInfo]) => ({
          ...txInfo,
          txFee: txInfo.txFee
            ? new Currency(txInfo.txFee, networkAsset)
            : undefined,
          minExFee: new Currency(txInfo.minExFee, networkAsset),
          maxExFee: new Currency(txInfo.maxExFee, networkAsset),
          refundableDeposit: new Currency(
            txInfo.refundableDeposit,
            networkAsset,
          ),
          minTotalFee: new Currency(
            txInfo.minExFee + (txInfo.txFee || 0n),
            networkAsset,
          ),
          maxTotalFee: new Currency(
            txInfo.maxExFee + (txInfo.txFee || 0n),
            networkAsset,
          ),
          minOutput: new Currency(txInfo.minOutput.amount, value.toAsset),
          maxOutput: new Currency(txInfo.maxOutput.amount, value.toAsset),
        })),
        publishReplay(1),
        refCount(),
      );
    },
  );

  useEffect(() => {
    const { pool, fromAmount, toAmount } = value;

    if (!pool || !fromAmount || !toAmount) {
      updateSwapTxInfo(value);
      return;
    }
    const baseInput =
      fromAmount.asset.id === pool.x.asset.id
        ? pool.pool.x.withAmount(fromAmount.amount)
        : pool.pool.y.withAmount(fromAmount.amount);

    const quoteOutput = pool.pool.outputAmount(baseInput, slippage);

    updateSwapTxInfo(value, {
      slippage,
      nitro,
      minExecutorReward: minExecutorReward,
      base: baseInput,
      quote: quoteOutput,
      changeAddress: settings.address!,
      pk: settings.ph!,
      txFees: ammTxFeeMapping,
      pool: pool.pool,
    });
  }, [value.fromAmount, value.toAmount, value.pool, nitro, slippage, settings]);

  return [swapTxInfo, isSwapTxInfoLoading, settings];
};
