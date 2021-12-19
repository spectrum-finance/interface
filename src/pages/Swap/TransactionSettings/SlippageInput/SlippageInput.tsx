import './SlippageInput.less';

import React, { ChangeEvent, ChangeEventHandler, FC } from 'react';

import {
  defaultSlippage,
  SlippageMax,
  SlippageMin,
} from '../../../../constants/settings';
import { Button, Flex, Input, Typography } from '../../../../ergodex-cdk';
import { Control } from '../../../../ergodex-cdk/components/Form/NewForm';

export type NitroInputProps = Control<number>;

export const SlippageInput: FC<NitroInputProps> = ({
  value,
  onChange,
  warningMessage,
  withWarnings,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.valueAsNumber);
    }
  };

  const handleClickSlippageAuto = () => {
    if (onChange) {
      onChange(defaultSlippage);
    }
  };

  return (
    <Flex col>
      <Flex justify="space-between">
        <Flex.Item marginRight={1}>
          <Button
            style={{ width: 47 }}
            type="primary"
            size="small"
            onClick={handleClickSlippageAuto}
          >
            Auto
          </Button>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Input
            value={value}
            onChange={handleInputChange}
            type="number"
            state={withWarnings ? 'warning' : undefined}
            min={SlippageMin}
            max={SlippageMax}
            size="small"
            suffix="%"
          />
        </Flex.Item>
      </Flex>
      <Typography.Body type="warning">{warningMessage}</Typography.Body>
    </Flex>
  );
};
