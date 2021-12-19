import React, { ChangeEvent, FC } from 'react';

import { MIN_NITRO } from '../../../../constants/erg';
import { Button, Flex, Input, Typography } from '../../../../ergodex-cdk';
import { Control } from '../../../../ergodex-cdk/components/Form/NewForm';

export type NitroInputProps = Control<number>;

export const NitroInput: FC<NitroInputProps> = ({
  onChange,
  value,
  errorMessage,
  invalid,
}) => {
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
      <Flex justify="space-between">
        <Flex.Item marginRight={1}>
          <Button
            style={{ width: 47 }}
            type="primary"
            size="small"
            onClick={handleClickNitroAuto}
          >
            Auto
          </Button>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Input
            type="number"
            min={MIN_NITRO}
            state={invalid ? 'error' : undefined}
            value={value}
            onChange={handleNitroChange}
            size="small"
          />
        </Flex.Item>
      </Flex>
      <Typography.Body type="danger">{errorMessage}</Typography.Body>
    </Flex>
  );
};
