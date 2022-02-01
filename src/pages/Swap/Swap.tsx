import './Swap.less';

import { maxBy } from 'lodash';
import { DateTime } from 'luxon';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { getAmmPoolsByPair } from '../../api/ammPools';
import { useAssetsBalance } from '../../api/assetBalance';
import { useSubscription } from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import {
  END_TIMER_DATE,
  LOCKED_TOKEN_ID,
} from '../../components/common/ActionForm/ActionButton/ActionButton';
import { ActionForm } from '../../components/common/ActionForm/ActionForm';
import { TokenControlFormItem } from '../../components/common/TokenControl/TokenControl';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { Page } from '../../components/Page/Page';
import { Button, Flex, SwapOutlined, Typography } from '../../ergodex-cdk';
import { useForm } from '../../ergodex-cdk/components/Form/NewForm';
import { assets$, getAvailableAssetFor } from '../../services/new/assets';
import { useMaxTotalFees, useNetworkAsset } from '../../services/new/core';
import { OperationSettings } from './OperationSettings/OperationSettings';
import { Ratio } from './Ratio/Ratio';
import { SwapConfirmationModal } from './SwapConfirmationModal/SwapConfirmationModal';
import { SwapFormModel } from './SwapFormModel';
import { SwapTooltip } from './SwapTooltip/SwapTooltip';

const getToAssets = (fromAsset?: string) =>
  fromAsset ? getAvailableAssetFor(fromAsset) : assets$;

const getSelectedPool = (
  xId?: string,
  yId?: string,
): Observable<AmmPool | undefined> =>
  xId && yId
    ? getAmmPoolsByPair(xId, yId).pipe(
        map((pools) => maxBy(pools, (p) => p.lp.amount)),
      )
    : of(undefined);

export const Swap = (): JSX.Element => {
  const form = useForm<SwapFormModel>({
    fromAmount: undefined,
    toAmount: undefined,
    fromAsset: undefined,
    toAsset: undefined,
    pool: undefined,
  });
  const networkAsset = useNetworkAsset();
  const [balance] = useAssetsBalance();
  const totalFees = useMaxTotalFees();
  const updateToAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const toAssets$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getToAssets)),
    [],
  );

  useEffect(() => form.patchValue({ fromAsset: networkAsset }), [networkAsset]);

  const getInsufficientTokenNameForFee = ({
    fromAmount,
  }: Required<SwapFormModel>) => {
    const totalFeesWithAmount = fromAmount.isAssetEquals(networkAsset)
      ? fromAmount.plus(totalFees)
      : totalFees;

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? networkAsset.name
      : undefined;
  };

  const getInsufficientTokenNameForTx = ({
    fromAsset,
    fromAmount,
  }: SwapFormModel) => {
    if (fromAsset && fromAmount && fromAmount.gt(balance.get(fromAsset))) {
      return fromAsset.name;
    }
    return undefined;
  };

  const isAmountNotEntered = ({ toAmount, fromAmount }: SwapFormModel) =>
    !fromAmount?.isPositive() || !toAmount?.isPositive();

  const isTokensNotSelected = ({ toAsset, fromAsset }: SwapFormModel) =>
    !toAsset || !fromAsset;

  const isSwapLocked = ({ toAsset, fromAsset }: SwapFormModel) =>
    (toAsset?.id === LOCKED_TOKEN_ID || fromAsset?.id === LOCKED_TOKEN_ID) &&
    DateTime.now().toUTC().toMillis() < END_TIMER_DATE.toMillis();

  const submitSwap = (value: Required<SwapFormModel>) => {
    openConfirmationModal(
      (next) => {
        return <SwapConfirmationModal value={value} onClose={next} />;
      },
      Operation.SWAP,
      {
        xAsset: value.fromAmount!,
        yAsset: value.toAmount!,
      },
    );
  };

  const isLiquidityInsufficient = ({ toAmount, pool }: SwapFormModel) => {
    if (!toAmount?.isPositive() || !pool) {
      return false;
    }
    return toAmount?.gt(pool.getAssetAmount(toAmount?.asset));
  };

  useSubscription(form.controls.fromAsset.valueChangesWithSilent$, (token) =>
    updateToAssets$.next(token?.id),
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
      form.controls.fromAsset.valueChangesWithSilent$.pipe(
        distinctUntilChanged(),
      ),
      form.controls.toAsset.valueChangesWithSilent$.pipe(
        distinctUntilChanged(),
      ),
    ]).pipe(
      debounceTime(100),
      distinctUntilChanged(([prevFrom, prevTo], [nextFrom, nextTo]) => {
        return (
          (prevFrom?.id === nextFrom?.id && prevTo?.id === nextTo?.id) ||
          (prevFrom?.id === nextTo?.id && prevTo?.id === nextFrom?.id)
        );
      }),
      tap(() => form.patchValue({ pool: undefined })),
      switchMap(([fromAsset, toAsset]) =>
        getSelectedPool(fromAsset?.id, toAsset?.id),
      ),
    ),
    (pool) => form.patchValue({ pool }),
  );

  useSubscription(
    combineLatest([
      form.controls.fromAmount.valueChangesWithSystem$,
      form.controls.pool.valueChanges$,
    ]).pipe(
      debounceTime(100),
      filter(([, pool]) => !!form.value.fromAsset && !!pool),
    ),
    ([amount, pool]) => {
      form.patchValue(
        { toAmount: amount ? pool?.calculateOutputAmount(amount) : undefined },
        { emitEvent: 'silent' },
      );
    },
  );

  useSubscription(
    form.controls.toAmount.valueChanges$.pipe(
      debounceTime(100),
      filter(() => !!form.value.toAsset && !!form.value.pool),
    ),
    (amount) => {
      form.patchValue(
        {
          fromAmount: amount
            ? form.value.pool?.calculateInputAmount(amount)
            : undefined,
        },
        { emitEvent: 'silent' },
      );
    },
  );

  const switchAssets = () => {
    form.patchValue(
      {
        fromAsset: form.value.toAsset,
        fromAmount: form.value.toAmount,
        toAsset: form.value.fromAsset,
      },
      { emitEvent: 'system' },
    );
  };

  const { t } = useTranslation();

  return (
    <Page width={480}>
      <ActionForm
        form={form}
        actionButton="Swap"
        getInsufficientTokenNameForFee={getInsufficientTokenNameForFee}
        getInsufficientTokenNameForTx={getInsufficientTokenNameForTx}
        isAmountNotEntered={isAmountNotEntered}
        isTokensNotSelected={isTokensNotSelected}
        isLiquidityInsufficient={isLiquidityInsufficient}
        isSwapLocked={isSwapLocked}
        action={submitSwap}
      >
        <Flex col>
          <Flex row align="center">
            <Flex.Item flex={1}>
              <Typography.Title level={4}>{t`swap.title`}</Typography.Title>
            </Flex.Item>
            <OperationSettings />
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
            <Button
              onClick={switchAssets}
              icon={<SwapOutlined />}
              size="middle"
            />
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
    </Page>
  );
};
