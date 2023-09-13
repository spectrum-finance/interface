import { Flex, Skeleton } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { CardanoAmmPool } from '../../api/ammPools/CardanoAmmPool';
import RefundableDepositTooltipContent from '../../components/RefundableDepositTooltipContent/RefundableDepositTooltipContent.tsx';
import { useSwapTxInfo } from '../common/useSwapTxInfo';

export interface SwapInfoContentProps {
  readonly value: SwapFormModel<CardanoAmmPool>;
}

export const SwapInfoContent: FC<SwapInfoContentProps> = ({ value }) => {
  const [swapTxInfo, isSwapTxInfoLoading] = useSwapTxInfo(value);

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          title={t`Minimum Output`}
          value={
            <>
              {isSwapTxInfoLoading ? (
                <Skeleton.Block active style={{ height: 12 }} />
              ) : swapTxInfo?.minOutput ? (
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon
                      size="extraSmall"
                      asset={swapTxInfo.minOutput.asset}
                    />
                  </Flex.Item>
                  {swapTxInfo.minOutput?.toString()}{' '}
                  <Truncate>{swapTxInfo.minOutput?.asset.ticker}</Truncate>
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
          tooltip={<RefundableDepositTooltipContent />}
          title={t`Refundable Deposit`}
          value={
            <>
              {isSwapTxInfoLoading ? (
                <Skeleton.Block active style={{ height: 12 }} />
              ) : swapTxInfo?.refundableDeposit ? (
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon
                      size="extraSmall"
                      asset={swapTxInfo.refundableDeposit.asset}
                    />
                  </Flex.Item>
                  {swapTxInfo.refundableDeposit.toString()}{' '}
                  <Truncate>
                    {swapTxInfo.refundableDeposit.asset.ticker}
                  </Truncate>
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
          tooltip={t`Charged by off-chain batchers`}
          title={t`Execution Fee`}
          value={
            <>
              {isSwapTxInfoLoading ? (
                <Skeleton.Block style={{ height: 12 }} active />
              ) : swapTxInfo?.minExFee && swapTxInfo?.maxExFee ? (
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon
                      size="extraSmall"
                      asset={swapTxInfo.minExFee.asset}
                    />
                  </Flex.Item>
                  {swapTxInfo.minExFee.toCurrencyString()} -{' '}
                  {swapTxInfo.maxExFee.toCurrencyString()}
                </Flex>
              ) : (
                '–'
              )}
            </>
          }
        />
      </Flex.Item>
      <SwapInfoItem
        tooltip={t`Charged by Cardano blockchain`}
        title={t`Network Fee`}
        value={
          <>
            {isSwapTxInfoLoading ? (
              <Skeleton.Block style={{ height: 12 }} active />
            ) : swapTxInfo?.txFee && swapTxInfo?.txFee ? (
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon asset={swapTxInfo.txFee.asset} size="extraSmall" />
                </Flex.Item>
                {swapTxInfo.txFee.toCurrencyString()}
              </Flex>
            ) : (
              '–'
            )}
          </>
        }
      />
    </Flex>
  );
};
