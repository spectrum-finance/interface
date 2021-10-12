import './TokenInput.less';

import React from 'react';

import { SwapInput, TokenSelect } from '../index';

interface TokenInputProps {
  value: string | number;
  onChange: (input: string) => void;
  tokenSymbol?: string | null;
  balance?: number;
  tokenPrice?: number;
}

const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  tokenSymbol,
  balance,
  tokenPrice,
}) => (
  <div className="token-input">
    <span className="from">From</span>

    <div className="input-select">
      <SwapInput
        value={value}
        onChange={onChange}
        tokenSymbol={tokenSymbol}
        balance={balance}
      />

      <TokenSelect name={tokenSymbol} />
    </div>
    <div className="usd-price">
      {tokenPrice && value && (
        <span>
          ~$
          {(
            tokenPrice * (typeof value === 'string' ? parseFloat(value) : value)
          ).toFixed(2)}
        </span>
      )}
    </div>
  </div>
);

export { TokenInput };
