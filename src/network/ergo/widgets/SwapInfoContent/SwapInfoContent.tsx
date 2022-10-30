import { Divider, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { calculateOutputs } from '../../../../common/utils/calculateOutputs';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { SwapInfoPriceImpact } from '../../../../pages/Swap/SwapInfo/SwapInfoPriceImpact/SwapInfoPriceImpact';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useNitro } from '../../settings/nitro';
import { useSlippage } from '../../settings/slippage';
import { useMaxTotalFee, useMinTotalFee } from '../../settings/totalFees';

export interface SwapInfoContent {
  readonly value: SwapFormModel<ErgoAmmPool>;
}

export const SwapInfoContent: FC<SwapInfoContent> = ({ value }) => {
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

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <SwapInfoPriceImpact value={value} />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          title={t`Minimum receivable`}
          value={
            minOutput ? (
              <>
                {minOutput?.toString()}{' '}
                <Truncate>{minOutput?.asset.name}</Truncate> (
                <ConvenientAssetView value={minOutput} />)
              </>
            ) : (
              '–'
            )
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Maximum receivable`}
          value={
            maxOutput ? (
              <>
                {maxOutput?.toString()}{' '}
                <Truncate>{maxOutput?.asset.name}</Truncate> (
                <ConvenientAssetView value={maxOutput} />)
              </>
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
          tooltip={
            <Flex col>
              <Flex.Item>
                <Typography.Body>Min Execution Fee: </Typography.Body>
                <Typography.Body strong>
                  {minExFee.toCurrencyString()}
                </Typography.Body>
              </Flex.Item>
              <Flex.Item>
                <Typography.Body>Max Execution Fee: </Typography.Body>
                <Typography.Body strong>
                  {maxExFee.toCurrencyString()}
                </Typography.Body>
              </Flex.Item>
            </Flex>
          }
          title={t`Execution Fee`}
          value={`${minExFee.toCurrencyString()} - ${maxExFee.toCurrencyString()}`}
          secondary
        />
      </Flex.Item>
      <Flex.Item marginBottom={1}>
        <SwapInfoItem
          title={t`Miner fee`}
          value={minerFee.toCurrencyString()}
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
