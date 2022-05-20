import { t, Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';

import { useSubject } from '../../../../common/hooks/useObservable';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { Divider, Flex } from '../../../../ergodex-cdk';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { SwapInfoPriceImpact } from '../../../../pages/Swap/SwapInfo/SwapInfoPriceImpact/SwapInfoPriceImpact';
import { CardanoAmmPool } from '../../api/ammPools/CardanoAmmPool';
import { depositAda } from '../../settings/depositAda';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { useMaxTotalFee, useMinTotalFee } from '../../settings/totalFee';
import { useTransactionFee } from '../../settings/transactionFee';
import { calculateSwapInfo, useSettings } from '../utils';

export interface SwapInfoContentProps {
  readonly value: SwapFormModel<CardanoAmmPool>;
}

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
          tooltip={t`Will be charged by off-chain execution bots and distributed among validators.`}
          title={t`Execution Fee`}
          value={`${minExFee.toCurrencyString()} - ${maxExFee.toCurrencyString()}`}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          tooltip={t`A small amount of ADA charged by Cardano blockchain.`}
          title={t`Transaction fee:`}
          value={transactionFee.toCurrencyString()}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          tooltip={
            <>
              <Trans>
                This amount of ADA will be held to construct the transaction and
                will be returned when your order is executed or cancelled.
              </Trans>
              <br />
              <a
                href="https://docs.cardano.org/plutus/collateral-mechanism"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Read More</Trans>
              </a>
            </>
          }
          title={t`Deposit ADA:`}
          value={depositAda.toCurrencyString()}
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
