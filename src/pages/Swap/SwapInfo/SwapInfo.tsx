import { t } from '@lingui/macro';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { calculateOutputs } from '../../../common/utils/calculateOutputs';
import { useSettings } from '../../../context';
import { Collapse, Divider, Flex, Typography } from '../../../ergodex-cdk';
import {
  useMaxExFee,
  useMaxTotalFees,
  useMinExFee,
  useMinTotalFees,
} from '../../../services/new/core';
import { SwapFormModel } from '../SwapFormModel';
import { SwapInfoHeader } from './SwapInfoHeader/SwapInfoHeader';
import { SwapInfoItem } from './SwapInfoItem/SwapInfoItem';

export interface SwapInfoProps {
  value: SwapFormModel;
  className?: string;
}

const getPriceImpactStatus = (
  priceImpact: number | undefined,
): 'success' | 'warning' | 'danger' | undefined => {
  if (priceImpact === undefined) {
    return undefined;
  }
  if (priceImpact < 1) {
    return 'success';
  }
  if (1 <= priceImpact && priceImpact <= 5) {
    return 'warning';
  }
  return 'danger';
};

const _SwapInfo: FC<SwapInfoProps> = ({ className, value }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const minTotalFee = useMinTotalFees();
  const maxTotalFee = useMaxTotalFees();
  const [{ minerFee, slippage, nitro }] = useSettings();

  const handleCollapseChange = () => setCollapsed((prev) => !prev);

  const priceImpact: number | undefined =
    value.fromAmount?.isPositive() &&
    value.toAmount?.isPositive() &&
    !!value.pool
      ? value.pool.calculatePriceImpact(value.fromAmount)
      : undefined;
  const priceImpactStatus = getPriceImpactStatus(priceImpact);

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
                  value={
                    <Typography.Body type={priceImpactStatus}>
                      {priceImpact !== undefined ? `${priceImpact}%` : '–'}
                    </Typography.Body>
                  }
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Minimum received:`}
                  value={minOutput?.toCurrencyString() || '–'}
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <SwapInfoItem
                  title={t`Maximum received:`}
                  value={maxOutput?.toCurrencyString() || '–'}
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <Divider />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Execution Fee`}
                  value={`${minExFee.toCurrencyString()} - ${maxExFee.toCurrencyString()}`}
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Miner fee:`}
                  value={`${minerFee} ERG`}
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title={t`Total fees:`}
                  value={`${minTotalFee.toCurrencyString()} - ${maxTotalFee.toCurrencyString()}`}
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
