import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import { calculateOutputs } from '../../../../../common/utils/calculateOutputs';
import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem';
import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import { useMaxExFee, useMinExFee } from '../../../settings/executionFee';
import { useMinerFee } from '../../../settings/minerFee';
import { useNitro } from '../../../settings/nitro';
import { useSlippage } from '../../../settings/slippage';
import { useMaxTotalFee, useMinTotalFee } from '../../../settings/totalFees';

export interface SwapConfirmationInfoProps {
  readonly value: Required<SwapFormModel>;
}

export const SwapConfirmationInfo: FC<SwapConfirmationInfoProps> = ({
  value,
}) => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const minTotalFee = useMinTotalFee();
  const maxTotalFee = useMaxTotalFee();
  const slippage = useSlippage();
  const minerFee = useMinerFee();
  const nitro = useNitro();

  const [minOutput, maxOutput] =
    value.fromAmount?.isPositive() &&
    value.toAmount?.isPositive() &&
    !!value.pool
      ? calculateOutputs(
          value.pool,
          value.fromAmount,
          minExFee,
          nitro,
          slippage,
        )
      : [undefined, undefined];

  const totalFees: [Currency, Currency] = [minTotalFee, maxTotalFee];
  const fees: FeesViewItem[] = [
    { caption: t`Miner Fee`, currency: minerFee },
    { caption: t`Execution Fee`, currency: [minExFee, maxExFee] },
  ];

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
              <Typography.Body strong size="large">
                {slippage}%
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
              <Typography.Body strong size="large">
                {nitro}
              </Typography.Body>
            }
          />
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={
              <Typography.Body size="large">
                <Trans>Estimated output:</Trans>
              </Typography.Body>
            }
            value={
              minOutput &&
              maxOutput && (
                <Typography.Body size="large" strong>
                  {`${minOutput?.toString()} - ${maxOutput?.toString()} `}
                  <Truncate>
                    {maxOutput?.asset.ticker || maxOutput?.asset.ticker}
                  </Truncate>
                </Typography.Body>
              )
            }
          />
        </Flex.Item>
        <FeesView totalFees={totalFees} fees={fees} />
      </Flex>
    </Box>
  );
};
