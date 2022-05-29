import { t, Trans } from '@lingui/macro';
import { maxBy } from 'lodash';
import { DateTime } from 'luxon';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  skip,
  switchMap,
  tap,
} from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
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
import {
  Button,
  Flex,
  Form,
  LineChartOutlined,
  SwapOutlined,
  Typography,
  useForm,
} from '../../ergodex-cdk';
import { getAmmPoolsByAssetPair } from '../../gateway/api/ammPools';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import { getAvailableAssetFor, tokenAssets$ } from '../../gateway/api/assets';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { useSwapValidationFee } from '../../gateway/api/validationFees';
import { useSelectedNetwork } from '../../gateway/common/network';
import { OperationSettings } from './OperationSettings/OperationSettings';
import { PoolSelector } from './PoolSelector/PoolSelector';
import { SwapConfirmationModal } from './SwapConfirmationModal/SwapConfirmationModal';
import { SwapFormModel } from './SwapFormModel';
import { SwapGraph } from './SwapGraph/SwapGraph';
import { SwapInfo } from './SwapInfo/SwapInfo';
import { SwitchButton } from './SwitchButton/SwitchButton';

const getToAssets = (fromAsset?: string) =>
  fromAsset ? getAvailableAssetFor(fromAsset) : tokenAssets$;

const isAssetsPairEquals = (
  [prevFrom, prevTo]: [AssetInfo | undefined, AssetInfo | undefined],
  [nextFrom, nextTo]: [AssetInfo | undefined, AssetInfo | undefined],
) =>
  (prevFrom?.id === nextFrom?.id && prevTo?.id === nextTo?.id) ||
  (prevFrom?.id === nextTo?.id && prevTo?.id === nextFrom?.id);

const getAvailablePools = (xId?: string, yId?: string): Observable<AmmPool[]> =>
  xId && yId ? getAmmPoolsByAssetPair(xId, yId) : of([]);

export const Swap = (): JSX.Element => {
  const form = useForm<SwapFormModel>({
    fromAmount: undefined,
    toAmount: undefined,
    fromAsset: undefined,
    toAsset: undefined,
    pool: undefined,
  });
  const [leftWidgetOpened, setLeftWidgetOpened] = useState<boolean>(false);
  const [lastEditedField, setLastEditedField] = useState<'from' | 'to'>('from');
  const [selectedNetwork] = useSelectedNetwork();
  const [networkAsset] = useNetworkAsset();
  const [balance] = useAssetsBalance();
  const totalFees = useSwapValidationFee();
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

  const isAmountNotEntered = ({ toAmount, fromAmount }: SwapFormModel) => {
    if (
      (!fromAmount?.isPositive() && toAmount?.isPositive()) ||
      (!toAmount?.isPositive() && fromAmount?.isPositive())
    ) {
      return false;
    }

    return !fromAmount?.isPositive() || !toAmount?.isPositive();
  };

  const getMinValueForToken = ({
    toAmount,
    fromAmount,
    fromAsset,
    toAsset,
    pool,
  }: SwapFormModel): Currency | undefined => {
    if (
      !fromAmount?.isPositive() &&
      toAmount &&
      toAmount.isPositive() &&
      pool &&
      toAmount.gte(pool.getAssetAmount(toAmount.asset))
    ) {
      return undefined;
    }

    if (!fromAmount?.isPositive() && toAmount?.isPositive() && pool) {
      // TODO: FIX_ERGOLABS_SDK_COMPUTING
      return pool.calculateOutputAmount(new Currency(1n, fromAsset)).plus(1n);
    }
    if (!toAmount?.isPositive() && fromAmount?.isPositive() && pool) {
      return pool.calculateInputAmount(new Currency(1n, toAsset));
    }
    return undefined;
  };

  const isTokensNotSelected = ({ toAsset, fromAsset }: SwapFormModel) =>
    !toAsset || !fromAsset;

  const isSwapLocked = ({ toAsset, fromAsset }: SwapFormModel) =>
    (toAsset?.id === LOCKED_TOKEN_ID || fromAsset?.id === LOCKED_TOKEN_ID) &&
    DateTime.now().toUTC().toMillis() < END_TIMER_DATE.toMillis();

  const isPoolLoading = ({ fromAsset, toAsset, pool }: SwapFormModel) =>
    !!fromAsset && !!toAsset && !pool;

  const submitSwap = (value: Required<SwapFormModel>) => {
    openConfirmationModal(
      (next) => {
        return (
          <SwapConfirmationModal
            value={value}
            onClose={(request) =>
              next(
                request.pipe(
                  tap((tx) => {
                    resetForm();
                    return tx;
                  }),
                ),
              )
            }
          />
        );
      },
      Operation.SWAP,
      {
        xAsset: value.fromAmount!,
        yAsset: value.toAmount!,
      },
    );
  };

  const resetForm = () =>
    form.patchValue(
      { fromAmount: undefined, toAmount: undefined },
      { emitEvent: 'silent' },
    );

  const handleMaxButtonClick = (balance: Currency) =>
    balance.asset.id === networkAsset.id ? balance.minus(totalFees) : balance;

  const isLiquidityInsufficient = ({ toAmount, pool }: SwapFormModel) => {
    if (!toAmount?.isPositive() || !pool) {
      return false;
    }
    return toAmount?.gte(pool.getAssetAmount(toAmount?.asset));
  };

  useSubscription(form.controls.fromAsset.valueChangesWithSilent$, (token) =>
    updateToAssets$.next(token?.id),
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
      distinctUntilChanged(isAssetsPairEquals),
      switchMap(([fromAsset, toAsset]) =>
        getAvailablePools(fromAsset?.id, toAsset?.id),
      ),
    ),
    (pools) => {
      if (!pools.length && form.value.toAsset && form.value.fromAsset) {
        form.patchValue(
          {
            pool: undefined,
            toAsset: undefined,
            toAmount:
              lastEditedField === 'to' ? form.value.toAmount : undefined,
            fromAmount:
              lastEditedField === 'from' ? form.value.fromAmount : undefined,
          },
          { emitEvent: 'silent' },
        );
        return;
      }

      const newPool =
        pools.find((p) => p.id === form.value.pool?.id) ||
        maxBy(pools, (p) => p.x.amount * p.y.amount);

      form.patchValue({ pool: newPool });
    },
    [lastEditedField],
  );

  useSubscription(
    form.controls.fromAmount.valueChanges$.pipe(skip(1)),
    (value) => {
      setLastEditedField('from');

      if (form.value.pool && value) {
        form.controls.toAmount.patchValue(
          form.value.pool.calculateOutputAmount(value),
          { emitEvent: 'silent' },
        );
      } else {
        form.controls.toAmount.patchValue(undefined, { emitEvent: 'silent' });
      }
    },
  );

  useSubscription(
    form.controls.toAmount.valueChanges$.pipe(skip(1)),
    (value) => {
      setLastEditedField('to');

      if (form.value.pool && value) {
        form.controls.fromAmount.patchValue(
          form.value.pool.calculateInputAmount(value),
          { emitEvent: 'silent' },
        );
      } else {
        form.controls.fromAmount.patchValue(undefined, { emitEvent: 'silent' });
      }
    },
  );

  useSubscription(
    form.controls.pool.valueChanges$,
    () => {
      const { fromAmount, toAmount, pool } = form.value;

      if (!pool) {
        return;
      }

      if (lastEditedField === 'from' && fromAmount && fromAmount.isPositive()) {
        form.controls.toAmount.patchValue(
          pool.calculateOutputAmount(fromAmount),
          { emitEvent: 'silent' },
        );
      }
      if (lastEditedField === 'to' && toAmount && toAmount.isPositive()) {
        form.controls.fromAmount.patchValue(
          pool.calculateInputAmount(toAmount),
          { emitEvent: 'silent' },
        );
      }
    },
    [lastEditedField],
  );

  const switchAssets = () => {
    form.patchValue(
      {
        fromAsset: form.value.toAsset,
        toAsset: form.value.fromAsset,
        fromAmount: form.value.toAmount,
        toAmount: form.value.fromAmount,
      },
      { emitEvent: 'silent' },
    );
    setLastEditedField((prev) => (prev === 'from' ? 'to' : 'from'));
  };

  const [pool] = useObservable(form.controls.pool.valueChangesWithSilent$);

  return (
    <ActionForm
      form={form}
      getInsufficientTokenNameForFee={getInsufficientTokenNameForFee}
      getInsufficientTokenNameForTx={getInsufficientTokenNameForTx}
      isLoading={isPoolLoading}
      getMinValueForToken={getMinValueForToken}
      isAmountNotEntered={isAmountNotEntered}
      isTokensNotSelected={isTokensNotSelected}
      isLiquidityInsufficient={isLiquidityInsufficient}
      isSwapLocked={isSwapLocked}
      action={submitSwap}
    >
      <Page
        width={504}
        leftWidget={
          selectedNetwork.name === 'ergo' &&
          pool?.id && <SwapGraph pool={pool} />
        }
        widgetOpened={leftWidgetOpened}
      >
        <Flex col>
          <Flex row align="center">
            <Flex.Item flex={1}>
              <Typography.Title level={4}>
                <Trans>Swap</Trans>
              </Typography.Title>
            </Flex.Item>
            {selectedNetwork.name === 'ergo' && pool?.id && (
              <Button
                type="text"
                size="large"
                icon={<LineChartOutlined />}
                onClick={() => setLeftWidgetOpened(!leftWidgetOpened)}
              />
            )}
            <OperationSettings />
          </Flex>
          <Flex.Item marginBottom={1} marginTop={2}>
            <TokenControlFormItem
              bordered
              maxButton
              handleMaxButtonClick={handleMaxButtonClick}
              assets$={tokenAssets$}
              label={t`From`}
              amountName="fromAmount"
              tokenName="fromAsset"
            />
          </Flex.Item>
          <SwitchButton
            onClick={switchAssets}
            icon={<SwapOutlined />}
            size="middle"
          />
          <Flex.Item>
            <TokenControlFormItem
              bordered
              assets$={toAssets$}
              label={t`To`}
              amountName="toAmount"
              tokenName="toAsset"
            />
          </Flex.Item>
          <Form.Item name="pool">
            {({ value, onChange }) => (
              <Flex.Item marginTop={!!value ? 4 : 0}>
                <PoolSelector value={value} onChange={onChange} />
              </Flex.Item>
            )}
          </Form.Item>
          <Form.Listener>
            {({ value }) => (
              <Flex.Item marginTop={!!value.pool ? 4 : 0}>
                <SwapInfo value={value} />
              </Flex.Item>
            )}
          </Form.Listener>
          <Flex.Item marginTop={4}>
            <ActionForm.Button>
              <Trans>Swap</Trans>
            </ActionForm.Button>
          </Flex.Item>
        </Flex>
      </Page>
    </ActionForm>
  );
};
