import { SwapParams } from '@ergolabs/cardano-dex-sdk';
import { Value } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { Box, Flex, Skeleton } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useEffect } from 'react';
import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { useSubject } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { SwapInfoPriceImpact } from '../../../../pages/Swap/SwapInfo/SwapInfoPriceImpact/SwapInfoPriceImpact';
import { CardanoAmmPool } from '../../api/ammPools/CardanoAmmPool';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../../api/operations/common/minExecutorReward';
import { transactionBuilder$ } from '../../api/operations/common/transactionBuilder';
import { settings } from '../../settings/settings';
import { useSettings } from '../utils';

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

const getTxInfo = (
  swapParams: SwapParams | undefined,
  value: SwapFormModel<CardanoAmmPool>,
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
      refundableDeposit: new Currency(txInfo.refundableDeposit, networkAsset),
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
};

export interface SwapInfoContentProps {
  readonly value: SwapFormModel<CardanoAmmPool>;
}

export const SwapInfoContent: FC<SwapInfoContentProps> = ({ value }) => {
  const { nitro, slippage } = useSettings();
  const [txInfo, updateTxInfo, txInfoLoading] = useSubject(getTxInfo);

  useEffect(() => {
    const { pool, fromAmount, toAmount } = value;

    if (!pool || !fromAmount || !toAmount) {
      updateTxInfo(undefined, value);
      return;
    }
    const baseInput =
      fromAmount.asset.id === pool.x.asset.id
        ? pool.pool.x.withAmount(fromAmount.amount)
        : pool.pool.y.withAmount(fromAmount.amount);
    const quoteOutput = pool.pool.outputAmount(baseInput, slippage);

    updateTxInfo(
      {
        slippage,
        nitro,
        minExecutorReward: minExecutorReward,
        base: baseInput,
        quote: quoteOutput,
        changeAddress: settings.address!,
        pk: settings.ph!,
        txFees: ammTxFeeMapping,
        pool: pool.pool,
      },
      value,
    );
  }, [value.fromAmount, value.toAmount, value.pool, nitro, slippage, settings]);

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <SwapInfoPriceImpact value={value} />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          title={t`Min output`}
          value={
            <>
              {txInfoLoading ? (
                <Skeleton.Block active style={{ height: 12 }} />
              ) : txInfo?.minOutput ? (
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon
                      size="extraSmall"
                      asset={txInfo.minOutput.asset}
                    />
                  </Flex.Item>
                  {txInfo.minOutput?.toString()}{' '}
                  <Truncate>{txInfo.minOutput?.asset.ticker}</Truncate>
                </Flex>
              ) : (
                '–'
              )}
            </>
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          tooltip={
            <>
              <Trans>
                This amount of ADA will be held to build a transaction and will
                be returned when your order is executed or canceled.
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
          value={
            <>
              {txInfoLoading ? (
                <Skeleton.Block active style={{ height: 12 }} />
              ) : txInfo?.refundableDeposit ? (
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon
                      size="extraSmall"
                      asset={txInfo.refundableDeposit.asset}
                    />
                  </Flex.Item>
                  {txInfo.refundableDeposit.toString()}{' '}
                  <Truncate>{txInfo.refundableDeposit.asset.ticker}</Truncate>
                </Flex>
              ) : (
                '–'
              )}
            </>
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Total fees`}
          value={
            <>
              {txInfoLoading ? (
                <Skeleton.Block active style={{ height: 12 }} />
              ) : txInfo?.minTotalFee && txInfo?.maxTotalFee ? (
                `${txInfo.minTotalFee.toCurrencyString()} - ${txInfo.maxTotalFee.toCurrencyString()}`
              ) : (
                '–'
              )}
            </>
          }
        />
      </Flex.Item>

      <Box padding={[1, 2]} bordered transparent borderRadius="m">
        <Flex col>
          <Flex.Item marginBottom={1}>
            <SwapInfoItem
              tooltip={t`Will be charged by off-chain execution bots and distributed among validators.`}
              title={t`Execution Fee`}
              value={
                <>
                  {txInfoLoading ? (
                    <Skeleton.Block style={{ height: 12 }} active />
                  ) : txInfo?.minExFee && txInfo?.maxExFee ? (
                    <Flex align="center">
                      <Flex.Item marginRight={1}>
                        <AssetIcon
                          size="extraSmall"
                          asset={txInfo.minExFee.asset}
                        />
                      </Flex.Item>
                      {txInfo.minExFee.toCurrencyString()} -{' '}
                      {txInfo.maxExFee.toCurrencyString()}
                    </Flex>
                  ) : (
                    '–'
                  )}
                </>
              }
            />
          </Flex.Item>
          <SwapInfoItem
            tooltip={t`A small amount of ADA charged by Cardano blockchain.`}
            title={t`Network Fee`}
            value={
              <>
                {txInfoLoading ? (
                  <Skeleton.Block style={{ height: 12 }} active />
                ) : txInfo?.txFee && txInfo?.txFee ? (
                  <Flex align="center">
                    <Flex.Item marginRight={1}>
                      <AssetIcon asset={txInfo.txFee.asset} size="extraSmall" />
                    </Flex.Item>
                    {txInfo.txFee.toCurrencyString()}
                  </Flex>
                ) : (
                  '–'
                )}
              </>
            }
          />
        </Flex>
      </Box>
    </Flex>
  );
};
