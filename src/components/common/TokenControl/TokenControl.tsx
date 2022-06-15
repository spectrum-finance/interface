import { AssetInfo } from '@ergolabs/ergo-sdk';
import { t, Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import {
  Animation,
  Box,
  Button,
  Flex,
  Form,
  Typography,
  useFormContext,
} from '../../../ergodex-cdk';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { ConvenientAssetView } from '../../ConvenientAssetView/ConvenientAssetView';
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
  disabled,
  readonly,
  handleMaxButtonClick,
}) => {
  const { form } = useFormContext();
  const [balance, balanceLoading] = useAssetsBalance();
  const [selectedAsset] = useObservable(
    tokenName
      ? form.controls[tokenName].valueChangesWithSilent$
      : of(undefined),
  );
  const _handleMaxButtonClick = (maxBalance: Currency) => {
    if (amountName) {
      const newAmount = handleMaxButtonClick
        ? handleMaxButtonClick(maxBalance)
        : maxBalance;

      form.controls[amountName].patchValue(
        newAmount.isPositive() ? newAmount : maxBalance,
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
    <Box padding={4} contrast borderRadius="m">
      <Flex col>
        {label && (
          <Flex.Item align="center" marginBottom={2}>
            <Flex.Item flex={1}>
              <Typography.Body secondary>{label}</Typography.Body>
            </Flex.Item>
            {selectedAsset !== undefined &&
              !balanceLoading &&
              readonly !== true && (
                <Typography.Body secondary>
                  {t`Balance:`} {balance.get(selectedAsset).toString()}
                </Typography.Body>
              )}
          </Flex.Item>
        )}
        <Flex.Item align="center">
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
          {selectedAsset !== undefined &&
            !balanceLoading &&
            !!balance.get(selectedAsset) &&
            maxButton && (
              <Button
                type="link"
                size="small"
                onClick={() =>
                  _handleMaxButtonClick(balance.get(selectedAsset))
                }
              >
                <Trans>Max</Trans>
              </Button>
            )}
          <Flex.Item marginLeft={2}>
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

        <Form.Listener name={amountName}>
          {({ value }) => (
            <Animation.Expand
              expanded={
                (selectedAsset !== undefined &&
                  !balanceLoading &&
                  readonly !== true &&
                  !label) ||
                value?.isPositive()
              }
            >
              <Flex.Item align="center" marginTop={2}>
                <Flex.Item flex={1}>
                  <Typography.Body secondary>
                    <ConvenientAssetView value={value} defaultValue="~$0.00" />
                  </Typography.Body>
                </Flex.Item>
                {selectedAsset !== undefined &&
                  !balanceLoading &&
                  readonly !== true &&
                  !label && (
                    <Typography.Body secondary>
                      {t`Balance:`} {balance.get(selectedAsset).toString()}
                    </Typography.Body>
                  )}
              </Flex.Item>
            </Animation.Expand>
          )}
        </Form.Listener>
      </Flex>
    </Box>
  );
};
