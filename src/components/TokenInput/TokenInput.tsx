import './TokenInput.less';

import React from 'react';

import { Box, Space, Typography } from '../../ergodex-cdk/components';
import { SwapInput } from '../SwapInput/SwapInput';
import { TokenSelect } from '../TokenSelect/TokenSelect';

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
  <Space className="token-input" direction="vertical" size={8}>
    <Typography.Text className="label">{label}</Typography.Text>

    <Space className="input-select" size={10}>
      <SwapInput
        value={value}
        onChange={onChange}
        tokenName={tokenName}
        balance={balance}
      />

      <TokenSelect name={tokenName} onTokenSelect={onSelectToken} />
    </Space>

    <Box className="usd-price-box" padding={0}>
      {tokenPrice && value && (
        <Typography.Text className="usd-price">
          ~$
          {(tokenPrice * parseFloat(value)).toFixed(2)}
        </Typography.Text>
      )}
    </Box>
  </Space>
);

export { TokenInput };
