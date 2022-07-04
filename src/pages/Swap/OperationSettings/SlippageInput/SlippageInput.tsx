import {
  Alert,
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Input,
} from '@ergolabs/ui-kit';
import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import {
  defaultSlippage,
  MAX_SLIPPAGE,
  MIN_SLIPPAGE,
} from '../../../../common/constants/settings';

export type NitroInputProps = Control<number> & { className?: string };

const SLIPPAGE_OPTIONS = [1, defaultSlippage, 7];

const _SlippageInput: FC<NitroInputProps> = ({
  value,
  onChange,
  state,
  message,
  className,
}) => {
  const isCustomSlippage = !SLIPPAGE_OPTIONS.some((val) => val === value);

  const handleClickSlippage = (percentage: number) => {
    if (onChange) {
      onChange(percentage);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.valueAsNumber);
    }
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={message ? 2 : 0}>
        <Box control borderRadius="m">
          <Flex justify="space-between">
            {SLIPPAGE_OPTIONS.sort().map((val, index) => (
              <Flex.Item key={index} marginRight={1} style={{ width: '100%' }}>
                <Button
                  block
                  type={val === value ? 'primary' : 'text'}
                  size="middle"
                  onClick={() => handleClickSlippage(val)}
                >
                  {val} %
                </Button>
              </Flex.Item>
            ))}
            <Flex.Item>
              <Input
                className={className}
                style={{ width: '128px' }}
                value={value}
                placeholder="1"
                state={state}
                type="number"
                min={MIN_SLIPPAGE}
                max={MAX_SLIPPAGE}
                size="middle"
                suffix="%"
                isActive={isCustomSlippage}
                onChange={handleInputChange}
              />
            </Flex.Item>
          </Flex>
        </Box>
      </Flex.Item>
      <Animation.Expand expanded={!!message}>
        <Alert showIcon type={state} message={message} />
      </Animation.Expand>
    </Flex>
  );
};

export const SlippageInput = styled(_SlippageInput)`
  input {
    text-align: right;

    /* stylelint-disable-next-line */
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      margin: 0;
      /* stylelint-disable-next-line */
      -webkit-appearance: none;
    }
  }
`;
