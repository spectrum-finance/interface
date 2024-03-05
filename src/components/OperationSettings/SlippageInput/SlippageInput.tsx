import {
  Alert,
  Animation,
  Box,
  Button,
  Control,
  Flex,
  Input,
} from '@ergolabs/ui-kit';
import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import {
  defaultSlippage,
  INFINITY_SLIPPAGE,
  MAX_SLIPPAGE,
  MIN_SLIPPAGE,
} from '../../../common/constants/settings';

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
      <Flex.Item marginBottom={2}>
        <Box secondary borderRadius="l" glass>
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
                inputMode="decimal"
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
      {/*<Flex.Item marginBottom={3} display="flex" align="center">*/}
      {/*  <Flex.Item marginRight={2}>*/}
      {/*    <Switch*/}
      {/*      checked={value === INFINITY_SLIPPAGE}*/}
      {/*      onChange={(e) =>*/}
      {/*        handleClickSlippage(e ? INFINITY_SLIPPAGE : defaultSlippage)*/}
      {/*      }*/}
      {/*    />*/}
      {/*  </Flex.Item>*/}
      {/*  <Typography.Body>*/}
      {/*    <Trans>Infinity slippage</Trans>*/}
      {/*  </Typography.Body>*/}
      {/*</Flex.Item>*/}
      <Animation.Expand expanded={!!message && value !== INFINITY_SLIPPAGE}>
        <Alert showIcon type={state} message={message} />
      </Animation.Expand>
      {/*<Animation.Expand expanded={value === INFINITY_SLIPPAGE}>*/}
      {/*  <Alert*/}
      {/*    showIcon*/}
      {/*    type="error"*/}
      {/*    message={*/}
      {/*      <Trans>*/}
      {/*        Using infinity slippage may cause permanent loss of all your funds*/}
      {/*        in a order. Make sure you understand what you are doing. If not,*/}
      {/*        reduce the slippage tolerance.*/}
      {/*      </Trans>*/}
      {/*    }*/}
      {/*  />*/}
      {/*</Animation.Expand>*/}
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
