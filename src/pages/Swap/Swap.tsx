/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import './Swap.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { maxBy } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  bufferTime,
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import {
  ActionForm,
  ActionFormStrategy,
} from '../../components/common/ActionForm/ActionForm';
import { TokenAmountInputValue } from '../../components/common/TokenControl/TokenAmountInput/TokenAmountInput';
import {
  NewTokenControl,
  TokenControlFormItem,
  TokenControlValue,
} from '../../components/common/TokenControl/TokenControl';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import {
  ERG_DECIMALS,
  ERG_TOKEN_ID,
  ERG_TOKEN_NAME,
  UI_FEE,
} from '../../constants/erg';
import { defaultExFee } from '../../constants/settings';
import { useSettings } from '../../context';
import { Button, Flex, SwapOutlined, Typography } from '../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../ergodex-cdk/components/Form/NewForm';
import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../hooks/useObservable';
import { assets$, getAvailableAssetFor } from '../../services/new/assets';
import { Balance, useWalletBalance } from '../../services/new/balance';
import { getPoolByPair, pools$ } from '../../services/new/pools';
import { fractionsToNum, parseUserInputToFractions } from '../../utils/math';
import { calculateTotalFee } from '../../utils/transactions';
import { Ratio } from './Ratio/Ratio';
import { SwapConfirmationModal } from './SwapConfirmationModal/SwapConfirmationModal';
import { SwapFormModel } from './SwapModel';
import { SwapTooltip } from './SwapTooltip/SwapTooltip';
import { TransactionSettings } from './TransactionSettings/TransactionSettings';

class SwapStrategy implements ActionFormStrategy<SwapFormModel> {
  constructor(private balance: Balance, private minerFee: number) {}

  actionButtonCaption(): React.ReactNode {
    return 'Swap';
  }

  getInsufficientTokenForFee(value: SwapFormModel): string | undefined {
    const { fromAmount, fromAsset } = value;
    let totalFees = +calculateTotalFee(
      [this.minerFee, UI_FEE, defaultExFee],
      ERG_DECIMALS,
    );
    totalFees =
      fromAsset?.id === ERG_TOKEN_ID
        ? totalFees + fromAmount?.value!
        : totalFees;

    return +totalFees > this.balance.get(ERG_TOKEN_ID)
      ? ERG_TOKEN_NAME
      : undefined;
  }

  getInsufficientTokenForTx(
    value: SwapFormModel,
  ): Observable<string | undefined> | string | undefined {
    const { fromAmount, fromAsset } = value;
    const asset = fromAsset;
    const amount = fromAmount?.value;

    if (asset && amount && amount > this.balance.get(asset)) {
      return asset.name;
    }

    return undefined;
  }

  isAmountNotEntered(value: SwapFormModel): boolean {
    return !value.fromAmount?.value || !value.toAmount?.value;
  }

  isTokensNotSelected(value: SwapFormModel): boolean {
    return !value.toAsset || !value.fromAsset;
  }

  request(value: SwapFormModel): void {
    openConfirmationModal(
      (next) => {
        return <SwapConfirmationModal value={value} onClose={next} />;
      },
      Operation.SWAP,
      { asset: value.fromAsset!, amount: value?.fromAmount?.value! },
      { asset: value.toAsset!, amount: value?.toAmount?.value! },
    );
  }

  isLiquidityInsufficient(value: SwapFormModel): boolean {
    const { toAmount, pool } = value;

    if (!toAmount?.value || !pool) {
      return false;
    }

    return (
      toAmount.value > fractionsToNum(pool?.y.amount, pool?.y.asset.decimals)
    );
  }
}

const convertToTo = (
  fromAmount: TokenAmountInputValue | undefined,
  fromAsset: AssetInfo,
  pool: AmmPool,
): number | undefined => {
  if (!fromAmount) {
    return undefined;
  }

  const toAmount = pool.outputAmount(
    new AssetAmount(
      fromAsset,
      parseUserInputToFractions(fromAmount.value!, fromAsset.decimals),
    ),
  );

  return fractionsToNum(toAmount.amount, toAmount.asset?.decimals);
};

const convertToFrom = (
  toAmount: TokenAmountInputValue | undefined,
  toAsset: AssetInfo,
  pool: AmmPool,
): number | undefined => {
  if (!toAmount) {
    return undefined;
  }

  const fromAmount = pool.inputAmount(
    new AssetAmount(
      toAsset,
      parseUserInputToFractions(toAmount.value!, toAsset.decimals),
    ),
  );

  return fromAmount
    ? fractionsToNum(fromAmount.amount, fromAmount.asset?.decimals)
    : undefined;
};

const getToAssets = (fromAsset?: string) =>
  fromAsset ? getAvailableAssetFor(fromAsset) : assets$;

const getSelectedPool = (
  xId?: string,
  yId?: string,
): Observable<AmmPool | undefined> =>
  xId && yId
    ? getPoolByPair(xId, yId).pipe(
        map((pools) => maxBy(pools, (p) => p.lp.amount)),
      )
    : of(undefined);

export const Swap = () => {
  const form = useForm<SwapFormModel>({
    fromAmount: undefined,
    toAmount: undefined,
    fromAsset: {
      name: 'ERG',
      id: '0000000000000000000000000000000000000000000000000000000000000000',
      decimals: ERG_DECIMALS,
    },
    toAsset: undefined,
    pool: undefined,
  });
  const [fromAssets] = useObservable(assets$);
  const [toAssets, updateToAssets] = useSubject(getToAssets);
  const [balance] = useWalletBalance();
  const [{ minerFee }] = useSettings();
  const strategy = useMemo(
    () => new SwapStrategy(balance, minerFee),
    [balance, minerFee],
  );

  useSubscription(
    form.controls.fromAsset.valueChanges$,
    (token: AssetInfo | undefined) => updateToAssets(token?.id),
  );

  useSubscription(form.controls.fromAsset.valueChanges$, () =>
    form.patchValue({
      toAsset: undefined,
      fromAmount: undefined,
      toAmount: undefined,
    }),
  );

  useSubscription(
    combineLatest([
      form.controls.fromAsset.valueChanges$,
      form.controls.toAsset.valueChanges$,
    ]).pipe(
      debounceTime(100),
      switchMap(([fromAsset, toAsset]) =>
        getSelectedPool(fromAsset?.id, toAsset?.id),
      ),
    ),
    (pool) => form.patchValue({ pool }),
  );

  useSubscription(
    combineLatest([
      form.controls.fromAmount.valueChanges$,
      form.controls.pool.valueChanges$,
    ]).pipe(
      debounceTime(100),
      filter(([amount, pool]) => !!amount && !!form.value.fromAsset && !!pool),
    ),
    ([amount, pool]) => {
      const toAmount = convertToTo(amount!, form.value.fromAsset!, pool!);
      form.patchValue(
        {
          toAmount: toAmount
            ? { value: toAmount, viewValue: toAmount.toString() }
            : undefined,
        },
        { emitEvent: 'system' },
      );
    },
  );

  useSubscription(
    combineLatest([
      form.controls.toAmount.valueChanges$,
      form.controls.pool.valueChanges$,
    ]).pipe(
      debounceTime(100),
      filter(([amount, pool]) => !!amount && !!form.value.toAsset && !!pool),
    ),
    ([amount, pool]) => {
      const fromAmount = convertToFrom(amount!, form.value.toAsset!, pool!);

      form.patchValue(
        {
          fromAmount: fromAmount
            ? { value: fromAmount, viewValue: fromAmount.toString() }
            : undefined,
        },
        { emitEvent: 'system' },
      );
    },
  );

  const swapTokens = () => {
    form.patchValue(
      {
        fromAsset: form.value.toAsset,
        fromAmount: form.value.toAmount,
        toAsset: form.value.fromAsset,
        toAmount: form.value.fromAmount,
      },
      { emitEvent: 'silent' },
    );
  };

  const { t } = useTranslation();

  return (
    <FormPageWrapper width={480}>
      <ActionForm form={form} strategy={strategy}>
        <Flex col>
          <Flex row align="center">
            <Flex.Item flex={1}>
              <Typography.Title level={4}>{t`swap.title`}</Typography.Title>
            </Flex.Item>
            <TransactionSettings />
          </Flex>
          <Flex.Item marginBottom={6} marginTop={-1}>
            <Typography.Footnote>{t`swap.subtitle`}</Typography.Footnote>
          </Flex.Item>
          <Flex.Item marginBottom={1}>
            <NewTokenControl
              assets={fromAssets}
              label={t`swap.fromLabel`}
              amountName="fromAmount"
              tokenName="fromAsset"
            />
          </Flex.Item>
          <Flex.Item className="swap-button">
            <Button onClick={swapTokens} icon={<SwapOutlined />} size="large" />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <NewTokenControl
              assets={toAssets}
              label={t`swap.toLabel`}
              amountName="toAmount"
              tokenName="toAsset"
            />
          </Flex.Item>
          <Flex>
            <Flex.Item marginRight={1}>
              <SwapTooltip form={form} />
            </Flex.Item>
            <Flex.Item flex={1}>
              <Ratio form={form} />
            </Flex.Item>
          </Flex>
        </Flex>
      </ActionForm>
    </FormPageWrapper>
  );
};
