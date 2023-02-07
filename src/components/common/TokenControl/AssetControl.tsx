import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Animation,
  Box,
  Flex,
  Form,
  Typography,
  useFormContext,
} from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';
import { Observable, of } from 'rxjs';

import { panalytics } from '../../../common/analytics';
import { PAnalytics } from '../../../common/analytics/@types/types';
import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { ConvenientAssetView } from '../../ConvenientAssetView/ConvenientAssetView';
import {
  AssetAmountInput,
  TokenAmountInputValue,
} from './AssetAmountInput/AssetAmountInput';
import { AssetBalance } from './AssetBalance/AssetBalance';
import { AssetSelect } from './AssetSelect/AssetSelect';

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

export interface AssetControlFormItemProps {
  readonly amountName?: string;
  readonly tokenName?: string;
  readonly maxButton?: boolean;
  readonly handleMaxButtonClick?: (balance: Currency) => Currency;
  readonly hasBorder?: boolean;
  readonly assets$?: Observable<AssetInfo[]>;
  readonly assetsToImport$?: Observable<AssetInfo[]>;
  readonly importedAssets$?: Observable<AssetInfo[]>;
  readonly disabled?: boolean;
  readonly readonly?: boolean | 'asset' | 'amount';
  readonly noBottomInfo?: boolean;
  readonly bordered?: boolean;
  readonly analytics?: PAnalytics;
  readonly loading?: boolean;
}

export const AssetControlFormItem: FC<AssetControlFormItemProps> = ({
  amountName,
  tokenName,
  maxButton,
  assets$,
  assetsToImport$,
  importedAssets$,
  disabled,
  readonly,
  handleMaxButtonClick,
  analytics,
  loading,
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
    <Box padding={4} secondary borderRadius="l" glass>
      <Flex col>
        <Flex.Item align="center">
          <Flex.Item marginRight={2} flex={1}>
            {amountName && (
              <Form.Item name={amountName}>
                {({ value, onChange }) => (
                  <AssetAmountInput
                    readonly={isAmountReadOnly() || loading}
                    value={value}
                    asset={selectedAsset}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            )}
          </Flex.Item>
          <Flex.Item marginLeft={2}>
            {tokenName && (
              <Form.Item name={tokenName}>
                {({ value, onChange }) => (
                  <AssetSelect
                    loading={loading}
                    assets$={assets$}
                    assetsToImport$={assetsToImport$}
                    importedAssets$={importedAssets$}
                    readonly={isAssetReadOnly()}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    analytics={analytics}
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
                  readonly !== true) ||
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
                  readonly !== true && (
                    <AssetBalance
                      balance={balance.get(selectedAsset)}
                      onClick={
                        maxButton
                          ? () =>
                              _handleMaxButtonClick(balance.get(selectedAsset))
                          : undefined
                      }
                    />
                  )}
              </Flex.Item>
            </Animation.Expand>
          )}
        </Form.Listener>
      </Flex>
    </Box>
  );
};
