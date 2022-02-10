import './TokenControl.less';

import { AssetInfo } from '@ergolabs/ergo-sdk';
import cn from 'classnames';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Observable, of } from 'rxjs';

import { useAssetsBalance } from '../../../api/assetBalance';
import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Animation, Box, Button, Flex, Typography } from '../../../ergodex-cdk';
import {
  Form,
  useFormContext,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { isWalletLoading$ } from '../../../services/new/core';
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
  readonly handleMaxButtonClick?: (balance: Currency) => Currency;
  readonly hasBorder?: boolean;
  readonly assets?: AssetInfo[];
  readonly assets$?: Observable<AssetInfo[]>;
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
  assets$,
  hasBorder,
  disabled,
  readonly,
  noBottomInfo,
  bordered,
  handleMaxButtonClick,
}) => {
  const { t } = useTranslation();
  const { form } = useFormContext();
  const [balance, balanceLoading] = useAssetsBalance();
  const [selectedAsset] = useObservable(
    tokenName
      ? form.controls[tokenName].valueChangesWithSilent$
      : of(undefined),
  );
  const [isWalletLoading] = useObservable(isWalletLoading$);

  const _handleMaxButtonClick = (maxBalance: Currency) => {
    if (amountName) {
      form.controls[amountName].patchValue(
        handleMaxButtonClick ? handleMaxButtonClick(maxBalance) : maxBalance,
      );
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
                {({ value, onChange }) => (
                  <TokenAmountInput
                    readonly={isAmountReadOnly()}
                    value={value}
                    asset={selectedAsset}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            )}
          </Flex.Item>
          <Flex.Item>
            {tokenName && (
              <Form.Item name={tokenName}>
                {({ value, onChange }) => (
                  <TokenSelect
                    assets$={assets$}
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
        {!noBottomInfo && (
          <Flex.Item marginBottom={1} marginTop={1}>
            <Flex
              direction="row"
              align="center"
              className="token-control-bottom-panel"
            >
              <Animation.Expand
                expanded={
                  selectedAsset !== undefined &&
                  !isWalletLoading &&
                  !balanceLoading
                }
              >
                {() => (
                  <>
                    <Flex.Item marginRight={2}>
                      <Typography.Body>
                        {t`common.tokenControl.balanceLabel`}{' '}
                        {balance.get(selectedAsset).toCurrencyString()}
                      </Typography.Body>
                    </Flex.Item>
                    {!!balance.get(selectedAsset) && maxButton && (
                      <Button
                        ghost
                        type="primary"
                        size="small"
                        onClick={() =>
                          _handleMaxButtonClick(balance.get(selectedAsset))
                        }
                      >
                        {t`common.tokenControl.maxButton`}
                      </Button>
                    )}
                  </>
                )}
              </Animation.Expand>
            </Flex>
          </Flex.Item>
        )}
      </Flex>
    </Box>
  );
};
