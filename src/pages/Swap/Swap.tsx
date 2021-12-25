/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import './Swap.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { maxBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { ActionForm } from '../../components/common/ActionForm/ActionForm';
import { TokenAmountInputValue } from '../../components/common/TokenControl/TokenAmountInput/TokenAmountInput';
import { TokenControlFormItem } from '../../components/common/TokenControl/TokenControl';
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
import { useForm } from '../../ergodex-cdk/components/Form/NewForm';
import { useSubscription } from '../../hooks/useObservable';
import { assets$, getAvailableAssetFor } from '../../services/new/assets';
import { useWalletBalance } from '../../services/new/balance';
import { Currency } from '../../services/new/currency';
import { getPoolByPair, Pool } from '../../services/new/pools';
import { fractionsToNum, parseUserInputToFractions } from '../../utils/math';
import { calculateTotalFee } from '../../utils/transactions';
import { Ratio } from './Ratio/Ratio';
import { SwapConfirmationModal } from './SwapConfirmationModal/SwapConfirmationModal';
import { SwapFormModel } from './SwapModel';
import { SwapTooltip } from './SwapTooltip/SwapTooltip';
import { TransactionSettings } from './TransactionSettings/TransactionSettings';

const getToAssets = (fromAsset?: string) =>
  fromAsset ? getAvailableAssetFor(fromAsset) : assets$;

const getSelectedPool = (
  xId?: string,
  yId?: string,
): Observable<Pool | undefined> =>
  xId && yId
    ? getPoolByPair(xId, yId).pipe(
        map((pools) => maxBy(pools, (p) => p.lp.amount)),
      )
    : of(undefined);

export const Swap = (): JSX.Element => {
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
  const [balance] = useWalletBalance();
  const [{ minerFee }] = useSettings();
  const updateToAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const toAssets$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getToAssets)),
    [],
  );

  const getInsufficientTokenNameForFee = (value: SwapFormModel) => {
    const { fromAmount, fromAsset } = value;
    let totalFees = new Currency(
      calculateTotalFee([minerFee, UI_FEE, defaultExFee], ERG_DECIMALS),
      {
        name: 'ERG',
        id: '0000000000000000000000000000000000000000000000000000000000000000',
        decimals: ERG_DECIMALS,
      },
    );
    totalFees =
      fromAsset?.id === ERG_TOKEN_ID ? totalFees.plus(fromAmount!) : totalFees;

    return totalFees.gt(
      balance.get({
        name: 'ERG',
        id: '0000000000000000000000000000000000000000000000000000000000000000',
        decimals: ERG_DECIMALS,
      }),
    )
      ? ERG_TOKEN_NAME
      : undefined;
  };

  const getInsufficientTokenNameForTx = (value: SwapFormModel) => {
    const { fromAmount, fromAsset } = value;
    const asset = fromAsset;
    const amount = fromAmount;

    if (asset && amount && amount.gt(balance.get(asset))) {
      return asset.name;
    }

    return undefined;
  };

  const isAmountNotEntered = (value: SwapFormModel) =>
    !value.fromAmount?.isPositive() || !value.toAmount?.isPositive();

  const isTokensNotSelected = (value: SwapFormModel) =>
    !value.toAsset || !value.fromAsset;

  const submitSwap = (value: Required<SwapFormModel>) => {
    openConfirmationModal(
      (next) => {
        return <SwapConfirmationModal value={value} onClose={next} />;
      },
      Operation.SWAP,
      value.fromAmount!,
      value.toAmount!,
    );
  };

  const isLiquidityInsufficient = (value: SwapFormModel) => {
    const { toAmount, pool } = value;

    if (!toAmount?.isPositive() || !pool) {
      return false;
    }

    return toAmount?.gt(pool.y);
  };

  useSubscription(
    form.controls.fromAsset.valueChangesWithSilent$,
    (token: AssetInfo | undefined) => updateToAssets$.next(token?.id),
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
      filter(([_, pool]) => !!form.value.fromAsset && !!pool),
    ),
    ([amount, pool]) => {
      form.patchValue(
        { toAmount: amount ? pool!.calculateOutputAmount(amount) : undefined },
        { emitEvent: 'system' },
      );
    },
  );

  useSubscription(
    combineLatest([form.controls.toAmount.valueChanges$]).pipe(
      debounceTime(100),
      filter(() => !!form.value.toAsset && !!form.value.pool),
    ),
    ([amount]) => {
      form.patchValue(
        {
          fromAmount: amount
            ? form.value.pool!.calculateInputAmount(amount!)
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
      <ActionForm
        form={form}
        actionButton="Swap"
        getInsufficientTokenNameForFee={getInsufficientTokenNameForFee}
        getInsufficientTokenNameForTx={getInsufficientTokenNameForTx}
        isAmountNotEntered={isAmountNotEntered}
        isTokensNotSelected={isTokensNotSelected}
        isLiquidityInsufficient={isLiquidityInsufficient}
        action={submitSwap}
      >
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
            <TokenControlFormItem
              maxButton
              assets$={assets$}
              label={t`swap.fromLabel`}
              amountName="fromAmount"
              tokenName="fromAsset"
            />
          </Flex.Item>
          <Flex.Item className="swap-button">
            <Button onClick={swapTokens} icon={<SwapOutlined />} size="large" />
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <TokenControlFormItem
              assets$={toAssets$}
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
