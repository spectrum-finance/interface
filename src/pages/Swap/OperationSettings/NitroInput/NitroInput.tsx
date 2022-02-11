import './NitroInput.less';

import React, { ChangeEvent, FC } from 'react';

import { MIN_NITRO } from '../../../../common/constants/erg';
import {
  Alert,
  Animation,
  Button,
  Control,
  Flex,
  Input,
  Typography,
} from '../../../../ergodex-cdk';
import { useMaxExFee, useMinExFee } from '../../../../services/new/core';

export type NitroInputProps = Control<number>;

export const NitroInput: FC<NitroInputProps> = ({
  onChange,
  value,
  message,
  state,
}) => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
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
        <Flex align="center">
          <Flex.Item marginRight={2}>
            <Button
              type={isMinimumNitro ? 'primary' : 'ghost'}
              size="middle"
              onClick={handleClickNitroAuto}
            >
              Minimum
            </Button>
          </Flex.Item>
          <Flex.Item marginRight={3}>
            <Input
              style={{ width: '90px' }}
              isActive={!isMinimumNitro}
              type="number"
              min={MIN_NITRO}
              state={state}
              value={value}
              onChange={handleNitroChange}
              size="middle"
            />
          </Flex.Item>
          <Flex col>
            <Typography.Body className="nitro-execution-fee">
              Execution Fee Range
            </Typography.Body>
            <Typography.Body className="nitro-execution-fee">
              {minExFee.toAmount()} - {maxExFee.toAmount()}{' '}
              {maxExFee.asset.name}
            </Typography.Body>
          </Flex>
        </Flex>
      </Flex.Item>
      <Animation.Expand expanded={!!message}>
        <Alert showIcon type={state} message={message} />
      </Animation.Expand>
    </Flex>
  );
};
