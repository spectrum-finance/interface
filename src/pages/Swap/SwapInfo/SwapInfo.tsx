import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { calculateOutputs } from '../../../common/utils/calculateOutputs';
import { useSettings } from '../../../context';
import { Collapse, Divider, Flex } from '../../../ergodex-cdk';
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
                  title="Slippage tolerance:"
                  value={`${slippage}%`}
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title="Minimum received:"
                  value={minOutput?.toCurrencyString() || '–'}
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <SwapInfoItem
                  title="Maximum received:"
                  value={maxOutput?.toCurrencyString() || '–'}
                />
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <Divider />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title="Execution Fee"
                  value={`${minExFee.toCurrencyString()} - ${maxExFee.toCurrencyString()}`}
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title="Miner fee:"
                  value={`${minerFee} ERG`}
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title="Lp fee:"
                  value={
                    value.fromAmount?.isPositive()
                      ? value.pool
                          .calculateLpFee(value.fromAmount)
                          .toCurrencyString()
                      : '–'
                  }
                  secondary
                />
              </Flex.Item>
              <Flex.Item marginBottom={2}>
                <SwapInfoItem
                  title="Total fees(except LP):"
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
