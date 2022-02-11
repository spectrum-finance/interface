import './SlippageInput.less';

import React, { ChangeEvent, FC } from 'react';

import {
  defaultSlippage,
  SlippageMax,
  SlippageMin,
} from '../../../../common/constants/settings';
import { Alert, Button, Control, Flex, Input } from '../../../../ergodex-cdk';

export type NitroInputProps = Control<number>;

const SLIPPAGE_OPTIONS = {
  '1': 1,
  '3': defaultSlippage,
  '7': 7,
};

export const SlippageInput: FC<NitroInputProps> = ({
  value,
  onChange,
  warningMessage,
  withWarnings,
}) => {
  const isCustomSlippage = !Object.values(SLIPPAGE_OPTIONS).some(
    (val) => val === value,
  );

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
      <Flex.Item marginBottom={2}>
        <Flex justify="space-between">
          {Object.values(SLIPPAGE_OPTIONS)
            .sort()
            .map((val, index) => (
              <Flex.Item key={index} marginRight={1} style={{ width: '100%' }}>
                <Button
                  block
                  type={val === value ? 'primary' : 'ghost'}
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
              style={{ width: '72px' }}
              value={value}
              placeholder="1"
              state={withWarnings ? 'warning' : undefined}
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
      </Flex.Item>
      {warningMessage && (
        <Alert showIcon type="warning" message={warningMessage} />
      )}
    </Flex>
  );
};
