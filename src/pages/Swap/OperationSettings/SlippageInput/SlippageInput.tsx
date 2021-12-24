import './SlippageInput.less';

import React, { ChangeEvent, FC, useState } from 'react';

import {
  defaultSlippage,
  SlippageMax,
  SlippageMin,
} from '../../../../constants/settings';
import { Alert, Button, Flex, Input } from '../../../../ergodex-cdk';
import { Control } from '../../../../ergodex-cdk/components/Form/NewForm';

export type NitroInputProps = Control<number>;

const SLIPPAGE_OPTIONS = {
  '0.1': defaultSlippage,
  '0.5': 0.5,
  '1': 1,
};

export const SlippageInput: FC<NitroInputProps> = ({
  value,
  onChange,
  warningMessage,
  withWarnings,
}) => {
  const [slippageActiveOption, setSlippageActiveOption] = useState<number>(
    SLIPPAGE_OPTIONS['0.1'],
  );

  // useEffect(() => {
  //   if (value) {
  //     setSlippageActiveOption(value);
  //   }
  // }, [value]);

  const handleClickSlippage = (pers: number) => {
    if (onChange) {
      onChange(pers);
      setSlippageActiveOption(pers);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.valueAsNumber);
    }
  };

  const handleInputFocus = () => {
    console.log('focus');
  };

  const handleInputBlur = () => {
    console.log('blur');
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <Flex justify="space-between">
          {Object.values(SLIPPAGE_OPTIONS)
            .sort()
            .map((val, index) => (
              <Flex.Item key={index} marginRight={1}>
                <Button
                  type={val == slippageActiveOption ? 'primary' : 'ghost'}
                  size="middle"
                  onClick={() => handleClickSlippage(val)}
                >
                  {val} %
                </Button>
              </Flex.Item>
            ))}
          <Flex.Item>
            <Input
              value={value}
              type="number"
              placeholder="1"
              state={withWarnings ? 'warning' : undefined}
              min={SlippageMin}
              max={SlippageMax}
              size="middle"
              suffix="%"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
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
