import './SwapInput.less';

import React from 'react';

import { Input } from '../../ergodex-cdk';
import { escapeRegExp } from './format';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

interface SwapInputProps {
  value: string;
  onChange: (input: string) => void;
  tokenName?: string | null;
  balance?: number;
}

const SwapInput: React.FC<SwapInputProps> = ({
  value,
  onChange,
  tokenName,
  balance,
}) => {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput.startsWith('.')) {
      nextUserInput = nextUserInput.replace('.', '0.');
    }
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onChange(nextUserInput);
    }
  };

  return (
    <div className="swap-input">
      {tokenName ? (
        <Input
          value={value}
          onChange={(event) => {
            enforcer(event.target.value.replace(/,/g, '.'));
          }}
          placeholder="0.0"
          suffix={
            <span>
              Balance: {balance} {tokenName.toUpperCase()}
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
