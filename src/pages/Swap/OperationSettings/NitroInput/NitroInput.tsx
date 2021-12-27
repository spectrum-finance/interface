import React, { ChangeEvent, FC } from 'react';

import { MIN_NITRO } from '../../../../constants/erg';
import { Alert, Button, Flex, Input } from '../../../../ergodex-cdk';
import { Control } from '../../../../ergodex-cdk/components/Form/NewForm';

export type NitroInputProps = Control<number>;

export const NitroInput: FC<NitroInputProps> = ({
  onChange,
  value,
  errorMessage,
  invalid,
}) => {
  const isMinimumNitro = value === MIN_NITRO;

  const handleClickNitroAuto = () => {
    if (onChange) {
      onChange(MIN_NITRO);
    }
  };

  const handleNitroChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.valueAsNumber);
    }
  };

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <Flex>
          <Flex.Item marginRight={1}>
            <Button
              type={isMinimumNitro ? 'primary' : 'ghost'}
              size="middle"
              onClick={handleClickNitroAuto}
            >
              Minimum
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Input
              style={{ maxWidth: '79px' }}
              isActive={!isMinimumNitro}
              type="number"
              min={MIN_NITRO}
              state={invalid ? 'error' : undefined}
              value={value}
              onChange={handleNitroChange}
              size="middle"
            />
          </Flex.Item>
        </Flex>
      </Flex.Item>
      {errorMessage && <Alert showIcon type="error" message={errorMessage} />}
    </Flex>
  );
};
