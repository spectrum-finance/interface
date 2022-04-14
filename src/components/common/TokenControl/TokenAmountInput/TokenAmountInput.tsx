import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../common/models/Currency';
import { EventConfig, Input } from '../../../../ergodex-cdk';
import { UsdView } from '../../../UsdView/UsdView';
import { escapeRegExp } from './format';
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export interface TokenAmountInputValue {
  viewValue: string | undefined;
  value: number | undefined;
}

export interface TokenAmountInputProps {
  value?: Currency;
  onChange?: (data: Currency | undefined, config?: EventConfig) => void;
  disabled?: boolean;
  readonly?: boolean;
  asset?: AssetInfo;
  className?: string;
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

const _TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  value,
  onChange,
  disabled,
  readonly,
  asset,
  className,
}) => {
  const [userInput, setUserInput] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Number(value?.toAmount()) !== Number(userInput)) {
      setUserInput(value?.toAmount());
    }
  }, [value]);

  useEffect(() => {
    if (value && asset) {
      const newValue = value?.changeAsset(asset);

      setUserInput(newValue?.toAmount());

      if (onChange && value.asset.id !== asset.id) {
        onChange(newValue, { emitEvent: 'silent' });
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
    setUserInput(userInput ?? '');
  };

  return (
    <Input
      readOnly={readonly}
      value={userInput}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
      className={className}
      placeholder="0.0"
      size="large"
      disabled={disabled}
      suffix={<UsdView value={value} prefix="~" defaultValue="~$0.00" />}
    />
  );
};

export const TokenAmountInput = styled(_TokenAmountInput)`
  background-color: var(--ergo-swap-input-bg) !important;
  font-size: 12px;
  input {
    background-color: var(--ergo-swap-input-bg) !important;
    box-shadow: none !important;
    font-size: 24px !important;
    font-weight: 600;
    height: 100%;
    line-height: 32px !important;
    padding: 5px 12px;
  }
`;
