import './TokenInput.less';

import React from 'react';

import {
  Box,
  Button,
  Col,
  Row,
  Space,
  Typography,
} from '../../ergodex-cdk/components';
import { SwapInput } from '../SwapInput/SwapInput';
import { TokenSelect } from '../TokenSelect/TokenSelect';

interface TokenInputProps {
  value?: string | '';
  onChange: (input: string) => void;
  onSelectToken?: React.MouseEventHandler<HTMLElement>;
  tokenName?: string | null;
  balance?: number;
  tokenPrice?: number;
  label: string;
  className?: string;
  disable?: boolean | false;
}

const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  onSelectToken,
  tokenName,
  tokenPrice,
  balance,
  label,
  className,
  disable,
}) => {
  const onSelectMax = () => {
    if (balance) {
      onChange(balance?.toString());
    }
  };

  return (
    <>
      <Box className={'token-input ' + className} borderRadius="m" padding={4}>
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
                tokenPrice={tokenPrice}
                disable={disable}
              />
              <TokenSelect
                name={tokenName}
                onTokenSelect={onSelectToken}
                disable={disable}
              />
            </Space>
          </Col>
        </Row>

        <Row className="token-input__bottom">
          <Col>
            {tokenName && (
              <>
                <Typography.Text disabled={disable}>
                  Balance: {balance} {tokenName.toUpperCase()}
                </Typography.Text>
                <Button
                  className="token-input__bottom-max-button"
                  ghost={true}
                  size="small"
                  onClick={onSelectMax}
                  disabled={disable}
                >
                  Max
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Box>
    </>
  );
};

export { TokenInput };
