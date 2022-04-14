import { t } from '@lingui/macro';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { calculateOutputs } from '../../../common/utils/calculateOutputs';
import { UsdView } from '../../../components/UsdView/UsdView';
import { useSettings } from '../../../context';
import { Collapse, Divider, Flex } from '../../../ergodex-cdk';
import {
  useMaxExFee,
  useMaxTotalFees,
  useMinExFee,
  useMinTotalFees,
} from '../../../services/new/core';
import { PriceImpactView } from '../PriceImpactView/PriceImpactView';
import { SwapFormModel } from '../SwapFormModel';
import { SwapInfoHeader } from './SwapInfoHeader/SwapInfoHeader';
import { SwapInfoItem } from './SwapInfoItem/SwapInfoItem';

export interface SwapInfoProps {
  value: SwapFormModel;
  className?: string;
}

const _SwapInfo: FC<SwapInfoProps> = ({ className, value }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const minTotalFee = useMinTotalFees();
  const maxTotalFee = useMaxTotalFees();
  const [{ minerFee, slippage, nitro }] = useSettings();

  const handleCollapseChange = () => setCollapsed((prev) => !prev);

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
    <>
      {!!value.pool && (
        <Collapse className={className} onChange={handleCollapseChange}>
          <Collapse.Panel
            key="info"
            header={<SwapInfoHeader collapsed={collapsed} value={value} />}
            showArrow={false}
          >
            <Flex col>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Slippage tolerance:`}
                  value={`${slippage}%`}
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Price impact:`}
                  value={<PriceImpactView value={value} />}
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Minimum output:`}
                  value={
                    (
                      <>
                        {minOutput?.toCurrencyString()}
                        {' ('}
                        <UsdView value={minOutput} />
                        {')'}
                      </>
                    ) || '–'
                  }
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <SwapInfoItem
                  title={t`Maximum output:`}
                  value={
                    (
                      <>
                        {maxOutput?.toCurrencyString()}
                        {' ('}
                        <UsdView value={maxOutput} />
                        {')'}
                      </>
                    ) || '–'
                  }
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <Divider />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Execution Fee`}
                  value={
                    <>
                      ${minExFee.toCurrencyString()} - $
                      {maxExFee.toCurrencyString()}
                      {' ('}
                      <UsdView value={minExFee} /> -
                      <UsdView value={maxExFee} />
                      {')'}
                    </>
                  }
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Miner fee:`}
                  value={<>${minerFee} ERG</>}
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Total fees:`}
                  value={
                    <>
                      ${minTotalFee.toCurrencyString()} - $
                      {maxTotalFee.toCurrencyString()}
                      {' ('}
                      <UsdView value={minTotalFee} /> -
                      <UsdView value={maxTotalFee} />
                      {')'}
                    </>
                  }
                />
              </Flex.Item>
            </Flex>
          </Collapse.Panel>
        </Collapse>
      )}
    </>
  );
};

export const SwapInfo = styled(_SwapInfo)`
  background: var(--ergo-box-bg-contrast);
  border: 1px solid var(--ergo-box-border-color);

  .ant-collapse-content-box {
    background: var(--ergo-box-bg-contrast);
    border-radius: var(--ergo-border-radius-md);
    padding-top: 0;
  }
`;
