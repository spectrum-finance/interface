import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { Currency } from '../../../../common/models/Currency';
import { calculateOutputs } from '../../../../common/utils/calculateOutputs';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { Truncate } from '../../../../components/Truncate/Truncate';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { SwapInfoItem } from '../../../../pages/Swap/SwapInfo/SwapInfoItem/SwapInfoItem';
import { SwapInfoPriceImpact } from '../../../../pages/Swap/SwapInfo/SwapInfoPriceImpact/SwapInfoPriceImpact';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { calculateUiFee } from '../../api/uiFee/uiFee';
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
  const [uiFee] = useObservable(
    calculateUiFee(value.fromAmount),
    [value.fromAmount],
    new Currency(0n, networkAsset),
  );
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
              <ConvenientAssetView value={[minerFee, minExFee, uiFee]} /> -{' '}
              <ConvenientAssetView value={[minerFee, maxExFee, uiFee]} />
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
          <Flex.Item marginBottom={2}>
            <SwapInfoItem
              title={t`Network Fee`}
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
          </Flex.Item>
          <SwapInfoItem
            title={t`Service Fee`}
            value={
              <Flex align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon asset={uiFee.asset} size="extraSmall" />
                </Flex.Item>
                {uiFee?.toCurrencyString()} (
                <ConvenientAssetView value={uiFee} />)
              </Flex>
            }
          />
        </Flex>
      </Box>
    </Flex>
  );
};
