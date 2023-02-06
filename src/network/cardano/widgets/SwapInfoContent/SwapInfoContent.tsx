import { Divider, Flex } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';

import { useSubject } from '../../../../common/hooks/useObservable';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { Truncate } from '../../../../components/Truncate/Truncate';
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
      <Flex.Item marginBottom={1}>
        <SwapInfoPriceImpact value={value} />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          title={t`Min output`}
          value={
            swapInfo?.minOutput ? (
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon
                    size="extraSmall"
                    asset={swapInfo.minOutput.asset}
                  />
                </Flex.Item>
                {swapInfo.minOutput?.toString()}{' '}
                <Truncate>{swapInfo.minOutput?.asset.ticker}</Truncate>
              </Flex>
            ) : (
              '–'
            )
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Divider />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          tooltip={t`Will be charged by off-chain execution bots and distributed among validators.`}
          title={t`Execution Fee`}
          value={`${minExFee.toCurrencyString()} - ${maxExFee.toCurrencyString()}`}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          tooltip={t`A small amount of ADA charged by Cardano blockchain.`}
          title={t`Transaction fee`}
          value={transactionFee.toCurrencyString()}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
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
          title={t`Refundable deposit`}
          value={depositAda.toCurrencyString()}
          secondary
        />
      </Flex.Item>
      <SwapInfoItem
        title={t`Total fees`}
        value={`${minTotalFee.toCurrencyString()} - ${maxTotalFee.toCurrencyString()}`}
      />
    </Flex>
  );
};
