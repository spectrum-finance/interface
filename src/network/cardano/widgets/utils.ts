import { minBudgetForSwap, mkTxMath } from '@ergolabs/cardano-dex-sdk';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { map, Observable } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../common/constants/erg';
import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Nitro, Percent } from '../../../common/types';
import { CardanoAmmPool } from '../api/ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../api/common/cardanoNetwork';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../api/operations/common/minExecutorReward';
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
