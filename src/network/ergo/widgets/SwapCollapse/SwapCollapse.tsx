import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable.ts';
import { Currency } from '../../../../common/models/Currency.ts';
import { calculateOutputs } from '../../../../common/utils/calculateOutputs.ts';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon.tsx';
import { BaseSwapCollapse } from '../../../../components/BaseSwapCollapse/BaseSwapCollapse.tsx';
import { SwapInfoItem } from '../../../../components/BaseSwapCollapse/SwapInfoItem/SwapInfoItem.tsx';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView.tsx';
import { Truncate } from '../../../../components/Truncate/Truncate.tsx';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel.ts';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool.ts';
import { networkAsset } from '../../api/networkAsset/networkAsset.ts';
import { calculateUiFee, minUiFee$ } from '../../api/uiFee/uiFee.ts';
import {
  useMaxExFee,
  useMinExFee,
} from '../../settings/executionFee/executionFee.ts';
import { useMinerFee } from '../../settings/minerFee.ts';
import { useNitro } from '../../settings/nitro.ts';
import { useSlippage } from '../../settings/slippage.ts';

export interface SwapCollapseProps {
  value: SwapFormModel<ErgoAmmPool>;
}

export const SwapCollapse: FC<SwapCollapseProps> = ({ value }) => {
  const { valBySize } = useDevice();

  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const slippage = useSlippage();
  const minerFee = useMinerFee();
  const [minUiFee] = useObservable(
    minUiFee$,
    [],
    new Currency(0n, networkAsset),
  );
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
    <>
      {!!value.pool && (
        <BaseSwapCollapse
          value={value}
          contentHeight={116}
          totalFees={
            <>
              <ConvenientAssetView value={[minerFee, minExFee, uiFee]} /> -{' '}
              <ConvenientAssetView value={[minerFee, maxExFee, uiFee]} />
            </>
          }
        >
          <Flex col>
            <Flex.Item marginBottom={1}>
              <SwapInfoItem
                title={t`Minimum Output`}
                value={
                  minOutput ? (
                    <Flex align="center">
                      <Flex.Item marginRight={1}>
                        <AssetIcon
                          size={valBySize('extraSmall', 'small')}
                          asset={value.toAsset!}
                        />
                      </Flex.Item>
                      <Typography.Body size={valBySize('small', 'base')}>
                        {minOutput.toString()}{' '}
                        <Truncate>{value.toAsset!.ticker}</Truncate> (
                        <ConvenientAssetView value={minOutput} />)
                      </Typography.Body>
                    </Flex>
                  ) : (
                    '–'
                  )
                }
              />
            </Flex.Item>

            <Flex.Item marginBottom={1}>
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
                      <AssetIcon
                        asset={minExFee.asset}
                        size={valBySize('extraSmall', 'small')}
                      />
                    </Flex.Item>
                    <Typography.Body size={valBySize('small', 'base')}>
                      {minExFee.toCurrencyString()} -{' '}
                      {maxExFee.toCurrencyString()} (
                      <>
                        <ConvenientAssetView value={minExFee} /> -{' '}
                        <ConvenientAssetView value={maxExFee} />
                      </>
                    </Typography.Body>
                    )
                  </Flex>
                }
              />
            </Flex.Item>
            <Flex.Item marginBottom={1}>
              <SwapInfoItem
                title={t`Network Fee`}
                value={
                  <Flex align="center">
                    <Flex.Item marginRight={1}>
                      <AssetIcon
                        asset={minerFee.asset}
                        size={valBySize('extraSmall', 'small')}
                      />
                    </Flex.Item>
                    <Typography.Body size={valBySize('small', 'base')}>
                      {minerFee.toCurrencyString()} (
                      <ConvenientAssetView value={minerFee} />)
                    </Typography.Body>
                  </Flex>
                }
              />
            </Flex.Item>
            <SwapInfoItem
              title={t`Service Fee`}
              tooltip={`To maintain high quality of service, we charge a service fee of 0.3% but not less than ${minUiFee.toCurrencyString()} of swap input spot price. This fee helps the team to cover the costs of maintaining the servers and improving this interface.`}
              value={
                <Flex align="center">
                  <Flex.Item marginRight={1}>
                    <AssetIcon
                      asset={uiFee.asset}
                      size={valBySize('extraSmall', 'small')}
                    />
                  </Flex.Item>
                  <Typography.Body size={valBySize('small', 'base')}>
                    {uiFee?.toCurrencyString()} (
                    <ConvenientAssetView value={uiFee} />)
                  </Typography.Body>
                </Flex>
              }
            />
          </Flex>
        </BaseSwapCollapse>
      )}
    </>
  );
};
