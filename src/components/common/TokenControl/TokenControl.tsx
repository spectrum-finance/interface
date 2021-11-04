import './TokenControl.less';

import { Form } from 'antd';
import React, { FC, ReactNode, useEffect, useState } from 'react';

import { useWallet } from '../../../context';
import { Box, Button, Flex, Typography } from '../../../ergodex-cdk';
import {
  TokenAmountInput,
  TokenAmountInputValue,
} from './TokenAmountInput/TokenAmountInput';
import { TokenSelect } from './TokenSelect/TokenSelect';

export interface TokenControlValue {
  amount?: TokenAmountInputValue;
  token?: string;
}

export interface TokenControlProps {
  readonly label?: ReactNode;
  readonly value?: TokenControlValue;
  readonly onChange?: (value: TokenControlValue) => void;
  readonly maxButton?: boolean;
  readonly getTokenBalance: (token: string) => Promise<any>;
}

export const TokenControl: FC<TokenControlProps> = ({
  label,
  value,
  onChange,
  maxButton,
  getTokenBalance,
}) => {
  const [balance, setBalance] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (value?.token) {
      getTokenBalance(value.token).then((balance) => setBalance(() => balance));
    } else {
      setBalance(undefined);
    }
  }, [value, getTokenBalance]);

  const onAmountChange = (amount: TokenAmountInputValue) => {
    if (onChange) {
      onChange({ ...value, amount });
    }
  };

  const onTokenChange = (token: string) => {
    if (onChange) {
      onChange({ ...value, token });
    }
  };

  const onMaxButtonClick = () => {
    if (onChange) {
      onChange({
        token: value?.token,
        amount: { value: balance, viewValue: balance?.toString() },
      });
    }
  };

  return (
    <Box padding={4} borderRadius="l" gray>
      <Flex flexDirection="col">
        <Flex.Item marginBottom={2}>
          <Typography.Body type="secondary">{label}</Typography.Body>
        </Flex.Item>

        <Flex.Item marginBottom={2}>
          <Flex flexDirection="row">
            <Flex.Item marginRight={2} flex={1}>
              <TokenAmountInput
                value={value?.amount}
                onChange={onAmountChange}
              />
            </Flex.Item>
            <Flex.Item>
              <TokenSelect name={value?.token} onChange={onTokenChange} />
            </Flex.Item>
          </Flex>
        </Flex.Item>

        <Flex
          flexDirection="row"
          alignItems="center"
          className="token-control-bottom-panel"
        >
          {balance && (
            <Flex.Item marginRight={2}>
              <Typography.Body>
                Balance: {balance} {value?.token}
              </Typography.Body>
            </Flex.Item>
          )}
          {balance && maxButton && (
            <Button
              ghost
              type="primary"
              size="small"
              onClick={onMaxButtonClick}
            >
              Max
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export interface TokenControlFormItemProps {
  readonly name: string;
  readonly label: ReactNode;
  readonly maxButton?: boolean;
}

export const TokenControlFormItem: FC<TokenControlFormItemProps> = ({
  label,
  name,
  maxButton,
}) => {
  const { getTokenBalance, isWalletConnected } = useWallet();

  const noop = () => Promise.resolve(undefined);

  return (
    <Form.Item name={name} className="token-form-item">
      <TokenControl
        getTokenBalance={isWalletConnected ? getTokenBalance : noop}
        maxButton={maxButton}
        label={label}
      />
    </Form.Item>
  );
};
