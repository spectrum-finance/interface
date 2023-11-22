import { AssetInfo } from '@ergolabs/ergo-sdk';
import {
  Animation,
  Flex,
  Form,
  Typography,
  useDevice,
  useFormContext,
} from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';
import { Observable, of } from 'rxjs';

import { useObservable } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { ConvenientAssetView } from '../../ConvenientAssetView/ConvenientAssetView';
import { PriceImpact } from '../../PriceImpact/PriceImpact.tsx';
import {
  AssetAmountInput,
  TokenAmountInputValue,
} from './AssetAmountInput/AssetAmountInput';
import { AssetBalance } from './AssetBalance/AssetBalance';
import styles from './AssetControl.module.less';
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
  readonly loading?: boolean;
  readonly priceImpact?: number;
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
  loading,
  priceImpact,
}) => {
  const { s, valBySize } = useDevice();
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
    <section className={styles.assetContainer}>
      <p className={styles.subTitle}>
        {amountName === 'fromAmount' ? 'Amount' : 'Converted To'}
      </p>
      <div className={styles.containerGroup}>
        <div className={styles.assetRow}>
          <div className={styles.assetGroup}>
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
                  />
                )}
              </Form.Item>
            )}
          </div>
          <div className={styles.inputGroup}>
            {amountName && (
              <Form.Item name={amountName}>
                {({ value, onChange }) => (
                  <AssetAmountInput
                    readonly={isAmountReadOnly() || loading}
                    value={value}
                    asset={selectedAsset}
                    onChange={onChange}
                    disabled={disabled}
                    s={s}
                  />
                )}
              </Form.Item>
            )}
          </div>
        </div>

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
              <div className={styles.infoGroup}>
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
                <Flex.Item align="center" marginTop={1}>
                  <Flex.Item flex={1}>
                    <Typography.Body
                      secondary
                      size={valBySize('small', 'base')}
                    >
                      <ConvenientAssetView value={value} />{' '}
                      {priceImpact !== undefined && (
                        <PriceImpact value={priceImpact} />
                      )}
                    </Typography.Body>
                  </Flex.Item>
                </Flex.Item>
              </div>
            </Animation.Expand>
          )}
        </Form.Listener>
      </div>
    </section>
  );
};
