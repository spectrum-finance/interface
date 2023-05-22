import { minBudgetForSwap, mkTxMath } from '@ergolabs/cardano-dex-sdk';
import { SwapParams } from '@ergolabs/cardano-dex-sdk';
import { Value } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { useEffect } from 'react';
import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../common/constants/erg';
import { useObservable, useSubject } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Nitro, Percent } from '../../../common/types';
import { SwapFormModel } from '../../../pages/Swap/SwapFormModel.ts';
import { CardanoAmmPool } from '../api/ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../api/common/cardanoNetwork';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../api/operations/common/minExecutorReward';
import { transactionBuilder$ } from '../api/operations/common/transactionBuilder.ts';
import { CardanoSettings, settings, settings$ } from '../settings/settings';

export interface SwapInfoParams {
  readonly pool?: CardanoAmmPool;
  readonly fromAmount?: Currency;
  readonly toAmount?: Currency;
  readonly nitro: Nitro;
  readonly slippage: Percent;
}

export interface SwapInfo {
  readonly minExFee: Currency;
  readonly maxExFee: Currency;
  readonly minOutput?: Currency;
  readonly maxOutput?: Currency;
}

export interface ExtendedTxInfo {
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

export const calculateSwapInfo = ({
  nitro,
  slippage,
  fromAmount,
  pool,
  toAmount,
}: SwapInfoParams): Observable<SwapInfo> =>
  cardanoNetworkParams$.pipe(
    map((params) => {
      const minExFee = new Currency(
        ammTxFeeMapping.swapOrder + minExecutorReward,
        networkAsset,
      );
      const maxExFee = new Currency(
        BigInt(Math.floor(Number(minExFee.amount) * nitro)),
        networkAsset,
      );

      if (!fromAmount || !toAmount || !pool) {
        return {
          minExFee,
          maxExFee,
        };
      }
      const baseInput =
        fromAmount.asset.id === pool.x.asset.id
          ? pool.pool.x.withAmount(fromAmount.amount)
          : pool.pool.y.withAmount(fromAmount.amount);
      const quoteOutput = pool.pool.outputAmount(baseInput, slippage);

      const txMath = mkTxMath(params.pparams, RustModule.CardanoWasm);
      const swapBudget = minBudgetForSwap(
        baseInput,
        quoteOutput,
        nitro,
        ammTxFeeMapping,
        minExecutorReward,
        UI_FEE_BIGINT,
        txMath,
      );

      if (!swapBudget) {
        return {
          minExFee,
          maxExFee,
        };
      }
      const [, , , swapExtremums] = swapBudget;

      return {
        minExFee,
        maxExFee,
        minOutput: new Currency(swapExtremums.minOutput.amount, toAmount.asset),
        maxOutput: new Currency(swapExtremums.maxOutput.amount, toAmount.asset),
      };
    }),
  );

export const useSettings = (): CardanoSettings => {
  const [_settings] = useObservable(settings$, [], settings);

  return _settings;
};

export const useSwapTxInfo = (
  value,
): [ExtendedTxInfo | undefined, boolean, CardanoSettings] => {
  const { nitro, slippage } = useSettings();

  const [swapTxInfo, updateSwapTxInfo, isSwapTxInfoLoading] = useSubject(
    (
      value: SwapFormModel<CardanoAmmPool>,
      swapParams?: SwapParams,
    ): Observable<ExtendedTxInfo | undefined> => {
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
