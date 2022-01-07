import './TokenAmountInput.less';

import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { useEffect, useState } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { Box, Input } from '../../../../ergodex-cdk';
import { escapeRegExp } from './format';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export interface TokenAmountInputValue {
  viewValue: string | undefined;
  value: number | undefined;
}

export interface TokenAmountInputProps {
  value?: Currency;
  onChange?: (data: Currency | undefined) => void;
  disabled?: boolean;
  readonly?: boolean;
  asset?: AssetInfo;
}

const isValidAmount = (
  value: string,
  asset: AssetInfo | undefined,
): boolean => {
  if (!asset) {
    return true;
  }
  if (!asset.decimals && value.indexOf('.') !== -1) {
    return false;
  }
  return (value.split('.')[1]?.length || 0) <= (asset?.decimals || 0);
};

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  value,
  onChange,
  disabled,
  readonly,
  asset,
}) => {
  const [userInput, setUserInput] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Number(value?.toString({ suffix: false })) !== Number(userInput)) {
      setUserInput(value?.toString({ suffix: false }));
    }
  }, [value]);

  useEffect(() => {
    if (value && asset) {
      const newValue = value?.changeAsset(asset);

      setUserInput(newValue.toString({ suffix: false }));

      if (onChange && value.asset.id !== asset.id) {
        onChange(newValue);
      }
    }
  }, [asset?.id]);

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput.startsWith('.')) {
      nextUserInput = nextUserInput.replace('.', '0.');
    }
    if (nextUserInput === '' && onChange) {
      setUserInput('');
      onChange(undefined);
      return;
    }
    if (
      inputRegex.test(escapeRegExp(nextUserInput)) &&
      onChange &&
      isValidAmount(nextUserInput, asset)
    ) {
      setUserInput(nextUserInput);
      onChange(new Currency(nextUserInput, asset));
      return;
    }
  };

  return (
    <Box className="swap-input" borderRadius="m" padding={0}>
      <Input
        readOnly={readonly}
        value={userInput}
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
