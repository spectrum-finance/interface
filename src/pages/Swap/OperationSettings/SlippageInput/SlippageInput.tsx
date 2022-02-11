import './SlippageInput.less';

import React, { ChangeEvent, FC } from 'react';

import {
  defaultSlippage,
  SlippageMax,
  SlippageMin,
} from '../../../../common/constants/settings';
import {
  Alert,
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Input,
} from '../../../../ergodex-cdk';

export type NitroInputProps = Control<number>;

const SLIPPAGE_OPTIONS = [1, defaultSlippage, 7];

export const SlippageInput: FC<NitroInputProps> = ({
  value,
  onChange,
  state,
  message,
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
        <Box contrast>
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
                className="slippage-input"
                style={{ width: '128px' }}
                value={value}
                placeholder="1"
                state={state}
                type="number"
                min={SlippageMin}
                max={SlippageMax}
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
