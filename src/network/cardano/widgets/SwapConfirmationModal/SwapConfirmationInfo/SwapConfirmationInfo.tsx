import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { AssetIcon } from '../../../../../components/AssetIcon/AssetIcon';
import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem';
import { FeesView } from '../../../../../components/FeesView/FeesView';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import { CardanoAmmPool } from '../../../api/ammPools/CardanoAmmPool';
import { FeesSkeletonLoading } from '../../../components/FeesSkeletonLoading/FeesSkeletonLoading.tsx';
import { useSwapTxInfo } from '../../common/useSwapTxInfo';

export interface SwapConfirmationInfoProps {
  readonly value: SwapFormModel<CardanoAmmPool>;
}

export const SwapConfirmationInfo: FC<SwapConfirmationInfoProps> = ({
  value,
}) => {
  const [swapTxInfo, isSwapTxInfoLoading, settings] = useSwapTxInfo(value);

  return (
    <Box secondary padding={4} borderRadius="l">
      <Flex col>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={
              <Typography.Body size="large">
                <Trans>Slippage tolerance:</Trans>
              </Typography.Body>
            }
            value={
              <Typography.Body size="large" strong>
                {settings.slippage}%
              </Typography.Body>
            }
          />
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={
              <Typography.Body size="large">
                <Trans>Nitro:</Trans>
              </Typography.Body>
            }
            value={
              <Typography.Body size="large" strong>
                {settings.nitro}
              </Typography.Body>
            }
          />
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={
              <Typography.Body size="large">
                <Trans>Min output:</Trans>
              </Typography.Body>
            }
            value={
              <Typography.Body size="large" strong>
                {swapTxInfo && swapTxInfo.minOutput ? (
                  <Flex align="center">
                    <Flex.Item marginRight={2}>
                      <AssetIcon
                        asset={swapTxInfo.minOutput?.asset}
                        size="small"
                      />
                    </Flex.Item>
                    {swapTxInfo.minOutput?.toString()}{' '}
                    <Truncate>{swapTxInfo.maxOutput?.asset.ticker}</Truncate>
                  </Flex>
                ) : (
                  <FeesSkeletonLoading />
                )}
              </Typography.Body>
            }
          />
        </Flex.Item>
        <FeesView
          feeItems={[{ caption: t`Network Fee`, fee: swapTxInfo?.txFee }]}
          executionFee={[swapTxInfo?.minExFee, swapTxInfo?.maxExFee]}
          refundableDeposit={swapTxInfo?.refundableDeposit}
          isLoading={isSwapTxInfoLoading}
        />
      </Flex>
    </Box>
  );
};
