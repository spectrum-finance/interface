import './TokenInput.less';

import React from 'react';

import { SwapInput, TokenSelect } from '../index';

interface TokenInputProps {
  value: string;
  onChange: (input: string) => void;
  onSelectToken?: React.MouseEventHandler<HTMLElement>;
  tokenName?: string | null;
  balance?: number;
  tokenPrice?: number;
  label: string;
}

const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  onSelectToken,
  tokenName,
  balance,
  tokenPrice,
  label,
}) => (
  <div className="token-input">
    <span className="label">{label}</span>

    <div className="input-select">
      <SwapInput
        value={value}
        onChange={onChange}
        tokenName={tokenName}
        balance={balance}
      />

      <TokenSelect name={tokenName} onTokenSelect={onSelectToken} />
    </div>
    <div className="usd-price">
      {tokenPrice && value && (
        <span>
          ~$
          {(tokenPrice * parseFloat(value)).toFixed(2)}
        </span>
      )}
    </div>
  </div>
);

export { TokenInput };
