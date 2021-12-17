import './TokenControl.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import cn from 'classnames';
import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { of } from 'rxjs';

import { Box, Button, Flex, Typography } from '../../../ergodex-cdk';
import {
  Form,
  useFormContext,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { useObservable, useSubject } from '../../../hooks/useObservable';
import {
  getBalanceByTokenId,
  useWalletBalance,
} from '../../../services/new/balance';
import {
  TokenAmountInput,
  TokenAmountInputValue,
} from './TokenAmountInput/TokenAmountInput';
import { TokenSelect } from './TokenSelect/TokenSelect';

export interface TokenControlValue {
  amount?: TokenAmountInputValue;
  asset?: AssetInfo;
}

export interface TokenControlProps {
  readonly label?: ReactNode;
  readonly value?: TokenControlValue;
  readonly onChange?: (value: TokenControlValue) => void;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

const getTokenBalanceByTokenName = (tokenName: string | undefined) =>
  tokenName ? getBalanceByTokenId(tokenName) : of(undefined);

export const TokenControl: FC<TokenControlProps> = ({
  label,
  value,
  onChange,
  maxButton,
  assets,
  hasBorder,
  disabled,
  readonly,
  noBottomInfo,
  bordered,
}) => {
  const { t } = useTranslation();
  const [balance, updateBalance] = useSubject(getTokenBalanceByTokenName);

  useEffect(() => {
    if (value?.asset) {
      updateBalance(value?.asset?.id);
    } else {
      updateBalance(undefined);
    }
  }, [value, updateBalance]);

  const onAmountChange = (amount: TokenAmountInputValue) => {
    if (onChange) {
      onChange({ ...value, amount });
    }
  };

  const onTokenChange = (asset: AssetInfo) => {
    if (onChange) {
      onChange({ ...value, asset });
    }
  };

  const onMaxButtonClick = () => {
    if (onChange) {
      onChange({
        asset: value?.asset,
        amount: { value: +(balance as any), viewValue: balance?.toString() },
      });
    }
  };

  return (
    <Box
      className={cn({
        'token-control--bordered': bordered,
        'token-control--has-border': hasBorder,
      })}
      padding={4}
      borderRadius="l"
      gray
    >
      <Flex direction="col">
        <Flex.Item marginBottom={2}>
          <Typography.Body type="secondary">{label}</Typography.Body>
        </Flex.Item>

        <Flex.Item marginBottom={noBottomInfo ? 0 : 2}>
          <Flex direction="row">
            <Flex.Item marginRight={2} flex={1}>
              <TokenAmountInput
                readonly={!!readonly && readonly !== 'asset'}
                value={value?.amount}
                decimals={value?.asset?.decimals}
                onChange={onAmountChange}
                disabled={disabled}
              />
            </Flex.Item>
            <Flex.Item>
              <TokenSelect
                assets={assets}
                readonly={!!readonly && readonly !== 'amount'}
                value={value?.asset}
                onChange={onTokenChange}
                disabled={disabled}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
        {!noBottomInfo && (
          <Flex
            direction="row"
            align="center"
            className="token-control-bottom-panel"
          >
            {balance !== undefined && (
              <Flex.Item marginRight={2}>
                <Typography.Body>
                  {t`common.tokenControl.balanceLabel`} {balance}{' '}
                  {value?.asset?.name}
                </Typography.Body>
              </Flex.Item>
            )}
            {balance !== undefined && maxButton && (
              <Button
                ghost
                type="primary"
                size="small"
                onClick={onMaxButtonClick}
              >
                {t`common.tokenControl.maxButton`}
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export interface TokenControlFormItemProps {
  readonly name: string;
  readonly label?: ReactNode;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export interface NewTokenControlProps {
  readonly amountName?: string;
  readonly tokenName?: string;
  readonly label?: ReactNode;
  readonly maxButton?: boolean;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
}

export const TokenControlFormItem: FC<NewTokenControlProps> = ({
  amountName,
  tokenName,
  label,
  maxButton,
  assets,
  hasBorder,
  disabled,
  readonly,
  noBottomInfo,
  bordered,
}) => {
  const { t } = useTranslation();
  const { form } = useFormContext();
  const [balance] = useWalletBalance();
  const [selectedAsset] = useObservable(
    tokenName ? form.controls[tokenName].valueChanges$ : of(undefined),
  );

  const handleMaxButtonClick = (maxBalance: number) => {
    if (amountName) {
      form.controls[amountName].patchValue({
        value: maxBalance,
        viewValue: maxBalance.toString(),
      });
    }
  };

  const isAmountReadOnly = () => {
    if (typeof readonly === 'boolean') {
      return readonly;
    }

    return readonly === 'amount';
  };

  const isAssetReadOnly = () => {
    if (typeof readonly === 'boolean') {
      return readonly;
    }

    return readonly === 'asset';
  };

  return (
    <Box
      className={cn({
        'token-control--bordered': bordered,
        'token-control--has-border': hasBorder,
      })}
      padding={4}
      borderRadius="l"
      gray
    >
      <Flex col>
        <Flex.Item marginBottom={2}>
          <Typography.Body type="secondary">{label}</Typography.Body>
        </Flex.Item>
        <Flex.Item display="flex" row marginBottom={noBottomInfo ? 0 : 2}>
          <Flex.Item marginRight={2} flex={1}>
            {amountName && (
              <Form.Item name={amountName}>
                {({ value, onChange, errorMessage }) => (
                  <>
                    {errorMessage}
                    <TokenAmountInput
                      readonly={isAmountReadOnly()}
                      value={value}
                      onChange={onChange}
                      disabled={disabled}
                    />
                  </>
                )}
              </Form.Item>
            )}
          </Flex.Item>
          <Flex.Item>
            {tokenName && (
              <Form.Item name={tokenName}>
                {({ value, onChange }) => (
                  <TokenSelect
                    assets={assets}
                    readonly={isAssetReadOnly()}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            )}
          </Flex.Item>
        </Flex.Item>
      </Flex>
      {!noBottomInfo && (
        <Flex
          direction="row"
          align="center"
          className="token-control-bottom-panel"
        >
          {selectedAsset !== undefined && (
            <Flex.Item marginRight={2}>
              <Typography.Body>
                {t`common.tokenControl.balanceLabel`}{' '}
                {balance.get(selectedAsset)} {selectedAsset?.name}
              </Typography.Body>
            </Flex.Item>
          )}
          {selectedAsset !== undefined &&
            !!balance.get(selectedAsset) &&
            maxButton && (
              <Button
                ghost
                type="primary"
                size="small"
                onClick={() => handleMaxButtonClick(balance.get(selectedAsset))}
              >
                {t`common.tokenControl.maxButton`}
              </Button>
            )}
        </Flex>
      )}
    </Box>
  );
};
