import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { EventConfig, Input } from '@ergolabs/ui-kit';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';

import { Currency } from '../../../../common/models/Currency';

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
    if (onChange) {
      setUserInput(nextUserInput);
      onChange(nextUserInput ? new Currency(nextUserInput, asset) : undefined);
      return;
    }
    setUserInput(userInput ?? '');
  };

  return (
    <NumberFormat
      readOnly={readonly}
      value={userInput || ''}
      className={className}
      type="tel"
      onValueChange={({ value }, { source }) => {
        if (source === 'event') {
          enforcer(value);
        }
      }}
      allowNegative={false}
      decimalScale={asset?.decimals || 0}
      thousandSeparator=" "
      decimalSeparator="."
      size="large"
      placeholder="0.0"
      customInput={Input}
      disabled={disabled}
    />
  );
};

export const AssetAmountInput = styled(_TokenAmountInput)`
  border-radius: initial !important;
  border-color: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  font-size: 24px !important;
  font-weight: 600;
  line-height: 32px !important;
  height: 100%;
`;
