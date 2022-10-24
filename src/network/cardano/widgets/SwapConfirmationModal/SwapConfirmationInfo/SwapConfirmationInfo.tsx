import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useEffect } from 'react';

import { useSubject } from '../../../../../common/hooks/useObservable';
import { Currency } from '../../../../../common/models/Currency';
import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem';
import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import { CardanoAmmPool } from '../../../api/ammPools/CardanoAmmPool';
import { depositAda } from '../../../settings/depositAda';
import { useMaxExFee, useMinExFee } from '../../../settings/executionFee';
import { useMaxTotalFee, useMinTotalFee } from '../../../settings/totalFee';
import { useTransactionFee } from '../../../settings/transactionFee';
import { calculateSwapInfo, useSettings } from '../../utils';

export interface SwapConfirmationInfoProps {
  readonly value: SwapFormModel<CardanoAmmPool>;
}

export const SwapConfirmationInfo: FC<SwapConfirmationInfoProps> = ({
  value,
}) => {
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
      pool: value.pool,
      toAmount: value.toAmount,
    });
  }, [value.fromAmount, value.toAmount, value.pool, nitro, slippage]);

  const totalFees: [Currency, Currency] = [minTotalFee, maxTotalFee];
  const fees: FeesViewItem[] = [
    { caption: t`Transaction Fee`, currency: transactionFee },
    { caption: t`Execution Fee`, currency: [minExFee, maxExFee] },
    { caption: t`Deposit ADA`, currency: depositAda },
  ];

  return (
    <Box secondary padding={4}>
      <Flex col>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={<Trans>Slippage tolerance:</Trans>}
            value={<Typography.Text>{slippage}%</Typography.Text>}
          />
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={<Trans>Nitro:</Trans>}
            value={<Typography.Text>{nitro}</Typography.Text>}
          />
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={<Trans>Estimated output:</Trans>}
            value={
              <Typography.Text>
                {swapInfo && (
                  <>
                    {`${swapInfo.minOutput?.toString()} - ${swapInfo.maxOutput?.toString()} `}
                    <Truncate>{swapInfo.maxOutput?.asset.name}</Truncate>
                  </>
                )}
              </Typography.Text>
            }
          />
        </Flex.Item>
        <FeesView totalFees={totalFees} fees={fees} />
      </Flex>
    </Box>
  );
};
