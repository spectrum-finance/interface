import './TokenInput.less';

import React from 'react';

import { Box, Col, Row, Space, Typography } from '../../ergodex-cdk/components';
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
  <Box className="token-input" borderRadius="m" padding={4}>
    <Row bottomGutter={2}>
      <Col>
        <Typography.Text className="token-input__label">
          {label}
        </Typography.Text>
      </Col>
    </Row>

    <Row bottomGutter={2}>
      <Col>
        <Space className="token-input__select" size={10}>
          <SwapInput
            value={value}
            onChange={onChange}
            tokenName={tokenName}
            balance={balance}
          />

          <TokenSelect name={tokenName} onTokenSelect={onSelectToken} />
        </Space>
      </Col>
    </Row>

    <Row className="token-input__bottom">
      <Col>
        {tokenPrice && value && (
          <Typography.Text className="token-input__bottom-usd-price">
            ~$
            {(tokenPrice * parseFloat(value)).toFixed(2)}
          </Typography.Text>
        )}
      </Col>
    </Row>
  </Box>
);

export { TokenInput };
