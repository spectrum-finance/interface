import './SwapInput.less';

import React from 'react';

import { escapeRegExp } from '../../utils/format';
import { Input } from '../index';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

interface SwapInputProps {
  value: string | number;
  onChange: (input: string) => void;
  tokenSymbol?: string | null;
  balance?: number;
}

const SwapInput: React.FC<SwapInputProps> = ({
  value,
  onChange,
  tokenSymbol,
  balance,
}) => {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onChange(nextUserInput);
    }
  };

  return (
    <div className="swap-input">
      {tokenSymbol ? (
        <Input
          value={value}
          onChange={(event) => {
            enforcer(event.target.value.replace(/,/g, '.'));
          }}
          placeholder="0.0"
          suffix={
            <span>
              Balance: {balance} {tokenSymbol.toUpperCase()}
            </span>
          }
        />
      ) : (
        <Input
          value={value}
          onChange={(event) => {
            enforcer(event.target.value.replace(/,/g, '.'));
          }}
          placeholder="0.0"
        />
      )}
    </div>
  );
};

export { SwapInput };
