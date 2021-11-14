import './TokenAmountInput.less';

import React from 'react';

import { Box, Input } from '../../../../ergodex-cdk';
import { toFloat } from '../../../../utils/string/string';
import { escapeRegExp } from './format';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export interface TokenAmountInputValue {
  viewValue: string | undefined;
  value: number | undefined;
}

export interface TokenAmountInputProps {
  value?: TokenAmountInputValue | number;
  onChange?: (data: TokenAmountInputValue) => void;
  disabled?: boolean;
  readonly?: boolean;
  decimals?: number;
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  value,
  onChange,
  disabled,
  readonly,
  decimals,
}) => {
  const normalizeViewValue = (
    value: TokenAmountInputValue | number | undefined,
  ): string | undefined => {
    if (typeof value === 'number') {
      return toFloat(value.toString(), decimals);
    }

    return toFloat(value?.viewValue || '', decimals);
  };

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput.startsWith('.')) {
      nextUserInput = nextUserInput.replace('.', '0.');
    }
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onChange &&
        onChange({
          viewValue: nextUserInput,
          value: nextUserInput !== undefined ? +nextUserInput : undefined,
        });
    }
  };

  return (
    <Box className="swap-input" borderRadius="m" padding={0}>
      <Input
        readOnly={readonly}
        value={normalizeViewValue(value)}
        onChange={(event) => {
          enforcer(event.target.value.replace(/,/g, '.'));
        }}
        placeholder="0.0"
        size="large"
        disabled={disabled}
      />
    </Box>
  );
};

export { TokenAmountInput };
