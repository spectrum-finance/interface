import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { calculateOutputs } from '../../../../common/utils/calculateOutputs';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { SwapInfoPriceImpact } from '../../../../pages/Swap/SwapInfo/SwapInfoPriceImpact/SwapInfoPriceImpact';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import {
  useMaxExFee,
  useMinExFee,
} from '../../settings/executionFee/executionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useNitro } from '../../settings/nitro';
import { useSlippage } from '../../settings/slippage';

export interface SwapInfoContent {
  readonly value: SwapFormModel<ErgoAmmPool>;
}

export const SwapInfoContent: FC<SwapInfoContent> = ({ value }) => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const slippage = useSlippage();
  const minerFee = useMinerFee();
  const nitro = useNitro();

  const [minOutput] =
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
          title={t`Min output`}
          value={
            minOutput ? (
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon size="extraSmall" asset={value.toAsset!} />
                </Flex.Item>
                {minOutput.toString()}{' '}
                <Truncate>{value.toAsset!.ticker}</Truncate> (
                <ConvenientAssetView value={minOutput} />)
              </Flex>
            ) : (
              '–'
            )
          }
        />
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <SwapInfoItem
          title={t`Total fees`}
          value={
            <>
              <ConvenientAssetView value={[minerFee, minExFee]} /> -{' '}
              <ConvenientAssetView value={[minerFee, maxExFee]} />
            </>
          }
        />
      </Flex.Item>

      <Box transparent borderRadius="m" bordered padding={[1, 2]}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <SwapInfoItem
              tooltip={
                <Flex col>
                  <Flex.Item>
                    <Typography.Body tooltip>
                      Min Execution Fee:{' '}
                    </Typography.Body>
                    <Typography.Body strong tooltip>
                      {minExFee.toCurrencyString()}
                    </Typography.Body>
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body tooltip>
                      Max Execution Fee:{' '}
                    </Typography.Body>
                    <Typography.Body strong tooltip>
                      {maxExFee.toCurrencyString()}
                    </Typography.Body>
                  </Flex.Item>
                </Flex>
              }
              title={t`Execution Fee`}
              value={
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon asset={minExFee.asset} size="extraSmall" />
                  </Flex.Item>
                  {minExFee.toCurrencyString()} - {maxExFee.toCurrencyString()}{' '}
                  (
                  <>
                    <ConvenientAssetView value={minExFee} /> -{' '}
                    <ConvenientAssetView value={maxExFee} />
                  </>
                  )
                </Flex>
              }
            />
          </Flex.Item>
          <SwapInfoItem
            title={t`Miner fee`}
            value={
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon asset={minerFee.asset} size="extraSmall" />
                </Flex.Item>
                {minerFee.toCurrencyString()} (
                <ConvenientAssetView value={minerFee} />)
              </Flex>
            }
          />
        </Flex>
      </Box>
    </Flex>
  );
};
