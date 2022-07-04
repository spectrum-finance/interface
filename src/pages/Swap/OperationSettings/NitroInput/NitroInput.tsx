import {
  Alert,
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Input,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import { MIN_NITRO } from '../../../../common/constants/erg';
import { useMaxExFee, useMinExFee } from '../../../../services/new/core';

export type NitroInputProps = Control<number> & { className?: string };

const _NitroInput: FC<NitroInputProps> = ({
  onChange,
  value,
  message,
  state,
  className,
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
        <Box control borderRadius="m">
          <Flex align="center">
            <Flex.Item marginRight={2}>
              <Button
                type={isMinimumNitro ? 'primary' : 'ghost'}
                size="middle"
                onClick={handleClickNitroAuto}
              >
                <Trans>Minimum</Trans>
              </Button>
            </Flex.Item>
            <Flex.Item flex={1}>
              <Input
                isActive={!isMinimumNitro}
                type="number"
                style={{ textAlign: 'right' }}
                min={MIN_NITRO}
                state={state}
                value={value}
                onChange={handleNitroChange}
                size="middle"
              />
            </Flex.Item>
          </Flex>
        </Box>
      </Flex.Item>
      <Flex.Item marginBottom={message ? 2 : 0}>
        <Typography.Body className={className}>
          <Trans>
            Execution Fee Range {minExFee.toString()} - {maxExFee.toString()}{' '}
            {maxExFee.asset.name}
          </Trans>
        </Typography.Body>
      </Flex.Item>
      <Animation.Expand expanded={!!message}>
        <Alert showIcon type={state} message={message} />
      </Animation.Expand>
    </Flex>
  );
};

export const NitroInput = styled(_NitroInput)`
  font-size: 12px !important;
  line-height: 20px !important;
`;
