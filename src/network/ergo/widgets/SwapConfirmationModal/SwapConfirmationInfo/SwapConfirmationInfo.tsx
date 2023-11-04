import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../../../common/hooks/useObservable';
import { Currency } from '../../../../../common/models/Currency';
import { calculateOutputs } from '../../../../../common/utils/calculateOutputs.ts';
import { AssetIcon } from '../../../../../components/AssetIcon/AssetIcon.tsx';
import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem.tsx';
import { FeesView } from '../../../../../components/FeesView/FeesView.tsx';
import { Truncate } from '../../../../../components/Truncate/Truncate.tsx';
import { SwapFormModel } from '../../../../../pages/Swap/SwapFormModel.ts';
import { networkAsset } from '../../../api/networkAsset/networkAsset';
import { calculateUiFee } from '../../../api/uiFee/uiFee';
import {
  useMaxExFee,
  useMinExFee,
} from '../../../settings/executionFee/executionFee.ts';
import { useMinerFee } from '../../../settings/minerFee.ts';
import { useNitro } from '../../../settings/nitro.ts';
import { useSlippage } from '../../../settings/slippage.ts';

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
  const [uiFee] = useObservable(
    calculateUiFee(value.fromAmount),
    [],
    new Currency(0n, networkAsset),
  );
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
                <Trans>Honey 🍯:</Trans>
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
          feeItems={[
            { caption: t`Network Fee`, fee: minerFee },
            { caption: t`Service Fee`, fee: uiFee },
          ]}
          executionFee={[minExFee, maxExFee]}
        />
      </Flex>
    </Box>
  );
};
