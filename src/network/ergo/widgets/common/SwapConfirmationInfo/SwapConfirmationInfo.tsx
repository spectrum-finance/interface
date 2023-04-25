import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { calculateOutputs } from '../../../../../common/utils/calculateOutputs';
import { AssetIcon } from '../../../../../components/AssetIcon/AssetIcon';
import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem';
import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel';
import {
  useMaxExFee,
  useMinExFee,
} from '../../../settings/executionFee/executionFee';
import { useMinerFee } from '../../../settings/minerFee';
import { useNitro } from '../../../settings/nitro';
import { useSlippage } from '../../../settings/slippage';

export interface SwapConfirmationInfoProps {
  readonly value: Required<SwapFormModel>;
}

export const SwapConfirmationInfo: FC<SwapConfirmationInfoProps> = ({
  value,
}) => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
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

  const fees: FeesViewItem[] = [
    { caption: t`Execution Fee`, currency: [minExFee, maxExFee] },
    { caption: t`Miner Fee`, currency: minerFee },
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
                <Trans>Min output:</Trans>
              </Typography.Body>
            }
            value={
              minOutput && (
                <Flex align="center">
                  <Flex.Item marginRight={2}>
                    <AssetIcon asset={minOutput.asset} size="small" />
                  </Flex.Item>
                  <Typography.Body size="large" strong>
                    {minOutput?.toString()}{' '}
                    <Truncate>
                      {maxOutput?.asset.ticker || maxOutput?.asset.name}
                    </Truncate>
                  </Typography.Body>
                </Flex>
              )
            }
          />
        </Flex.Item>
        <FeesView
          fees={fees}
          totalFees={{
            minFeesForTotal: [minerFee, minExFee],
            maxFeesForTotal: [minerFee, maxExFee],
          }}
        />
      </Flex>
    </Box>
  );
};
