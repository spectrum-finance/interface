import { minBudgetForSwap, mkTxMath } from '@ergolabs/cardano-dex-sdk';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { t } from '@lingui/macro';
import React, { FC, useEffect } from 'react';
import { from, map, Observable } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import {
  useObservable,
  useSubject,
} from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { Nitro, Percent } from '../../../../common/types';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { Divider, Flex } from '../../../../ergodex-cdk';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { SwapInfoPriceImpact } from '../../../../pages/Swap/SwapInfo/SwapInfoPriceImpact/SwapInfoPriceImpact';
import { CardanoAmmPool } from '../../api/ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../../api/common/cardanoNetwork';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../../api/operations/common/minExecutorReward';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { settings, settings$ } from '../../settings/settings';
import { useMaxTotalFee, useMinTotalFee } from '../../settings/totalFee';
import { useTransactionFee } from '../../settings/transactionFee';

interface SwapInfoParams {
  readonly pool?: CardanoAmmPool;
  readonly fromAmount?: Currency;
  readonly toAmount?: Currency;
  readonly nitro: Nitro;
  readonly slippage: Percent;
}

interface SwapInfo {
  readonly minExFee: Currency;
  readonly maxExFee: Currency;
  readonly minOutput?: Currency;
  readonly maxOutput?: Currency;
}

const calculateSwapInfo = ({
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
      console.log(minExFee, maxExFee);
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

export interface SwapInfoContentProps {
  readonly value: SwapFormModel;
}
const useSettings = () => {
  const [_settings] = useObservable(settings$, [], settings);

  return _settings;
};

export const SwapInfoContent: FC<SwapInfoContentProps> = ({ value }) => {
  const { nitro, slippage } = useSettings();
  const minExFee = useMinExFee('swap');
  const maxExFee = useMaxExFee('swap');
  const minTotalFee = useMinTotalFee('swap');
  const maxTotalFee = useMaxTotalFee('swap');
  const transactionFee = useTransactionFee('swap');
  const [swapInfo, updateSwapInfo] = useSubject(calculateSwapInfo);

  useEffect(() => {
    updateSwapInfo({
      nitro,
      slippage,
      fromAmount: value.fromAmount,
      pool: value.pool as any,
      toAmount: value.toAmount,
    });
  }, [value.fromAmount, value.toAmount, value.pool, nitro, slippage]);

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem title={t`Slippage tolerance:`} value={`${slippage}%`} />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoPriceImpact value={value} />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Minimum receivable:`}
          value={
            swapInfo?.minOutput ? (
              <>
                {swapInfo.minOutput?.toString()}{' '}
                <Truncate>{swapInfo.minOutput?.asset.name}</Truncate>
              </>
            ) : (
              '–'
            )
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <SwapInfoItem
          title={t`Maximum receivable:`}
          value={
            swapInfo?.maxOutput ? (
              <>
                {swapInfo.maxOutput?.toString()}{' '}
                <Truncate>{swapInfo.maxOutput?.asset.name}</Truncate>
              </>
            ) : (
              '–'
            )
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Divider />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Execution Fee`}
          value={`${minExFee.toCurrencyString()} - ${maxExFee.toCurrencyString()}`}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Transaction fee:`}
          value={transactionFee.toCurrencyString()}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Total fees:`}
          value={`${minTotalFee.toCurrencyString()} - ${maxTotalFee.toCurrencyString()}`}
        />
      </Flex.Item>
    </Flex>
  );
};
