import { Flex, Skeleton, Typography, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon.tsx';
import { BaseSwapCollapse } from '../../../../components/BaseSwapCollapse/BaseSwapCollapse.tsx';
import { SwapInfoItem } from '../../../../components/BaseSwapCollapse/SwapInfoItem/SwapInfoItem.tsx';
import { Truncate } from '../../../../components/Truncate/Truncate.tsx';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel.ts';
import { CardanoAmmPool } from '../../api/ammPools/CardanoAmmPool.ts';
import RefundableDepositTooltipContent from '../../components/RefundableDepositTooltipContent/RefundableDepositTooltipContent.tsx';
import { useSwapTxInfo } from '../common/useSwapTxInfo.ts';

export interface SwapCollapseProps {
  value: SwapFormModel<CardanoAmmPool>;
}

export const SwapCollapse: FC<SwapCollapseProps> = ({ value }) => {
  const { valBySize } = useDevice();
  const [swapTxInfo, isSwapTxInfoLoading] = useSwapTxInfo(value);

  return (
    <>
      {!!value.pool && (
        <BaseSwapCollapse
          value={value}
          contentHeight={140}
          totalFees={
            <>
              {isSwapTxInfoLoading ? (
                <Skeleton.Block
                  active
                  style={{ height: '22px', maxWidth: '20px' }}
                />
              ) : swapTxInfo?.minTotalFee && swapTxInfo?.maxTotalFee ? (
                `${(Number(swapTxInfo.minTotalFee.toString()) + 1).toFixed(
                  2,
                )} - ${(Number(swapTxInfo.maxTotalFee.toString()) + 1).toFixed(
                  2,
                )} ADA`
              ) : (
                '–'
              )}
            </>
          }
        >
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
                            size={valBySize('extraSmall', 'small')}
                            asset={swapTxInfo.minOutput.asset}
                          />
                        </Flex.Item>
                        <Typography.Body size={valBySize('small', 'base')}>
                          {swapTxInfo.minOutput?.toString()}{' '}
                          <Truncate>
                            {swapTxInfo.minOutput?.asset.ticker}
                          </Truncate>
                        </Typography.Body>
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
                            size={valBySize('extraSmall', 'small')}
                            asset={swapTxInfo.refundableDeposit.asset}
                          />
                        </Flex.Item>
                        <Typography.Body size={valBySize('small', 'base')}>
                          {swapTxInfo.refundableDeposit.toString()}{' '}
                          <Truncate>
                            {swapTxInfo.refundableDeposit.asset.ticker}
                          </Truncate>
                        </Typography.Body>
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
                tooltip={t`Charged by off-chain badgers 🦡`}
                title={t`Honey 🍯`}
                value={
                  <>
                    {isSwapTxInfoLoading ? (
                      <Skeleton.Block style={{ height: 12 }} active />
                    ) : swapTxInfo?.minExFee && swapTxInfo?.maxExFee ? (
                      <Flex align="center">
                        <Flex.Item marginRight={1}>
                          <AssetIcon
                            size={valBySize('extraSmall', 'small')}
                            asset={swapTxInfo.minExFee.asset}
                          />
                        </Flex.Item>
                        <Typography.Body size={valBySize('small', 'base')}>
                          {swapTxInfo.minExFee.toCurrencyString()} -{' '}
                          {swapTxInfo.maxExFee.toCurrencyString()}
                        </Typography.Body>
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
                        <AssetIcon
                          size={valBySize('extraSmall', 'small')}
                          asset={swapTxInfo.txFee.asset}
                        />
                      </Flex.Item>
                      <Typography.Body size={valBySize('small', 'base')}>
                        {swapTxInfo.txFee.toCurrencyString()}
                      </Typography.Body>
                    </Flex>
                  ) : (
                    '–'
                  )}
                </>
              }
            />
            <Flex.Item marginBottom={1}>
              <SwapInfoItem
                tooltip={`Charged by TeddySwap DAO`}
                title={`UI Fee`}
                value={
                  <>
                    {isSwapTxInfoLoading ? (
                      <Skeleton.Block style={{ height: 12 }} active />
                    ) : swapTxInfo?.minExFee && swapTxInfo?.maxExFee ? (
                      <Flex align="center">
                        <Flex.Item marginRight={1}>
                          <AssetIcon
                            size={valBySize('extraSmall', 'small')}
                            asset={swapTxInfo.minExFee.asset}
                          />
                        </Flex.Item>
                        <Typography.Body size={valBySize('small', 'base')}>
                          1 ADA
                        </Typography.Body>
                      </Flex>
                    ) : (
                      '–'
                    )}
                  </>
                }
              />
            </Flex.Item>
          </Flex>
        </BaseSwapCollapse>
      )}
    </>
  );
};
