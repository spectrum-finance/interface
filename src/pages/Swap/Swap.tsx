import {
  Button,
  Flex,
  Form,
  FormGroup,
  LineChartOutlined,
  SwapOutlined,
  Typography,
  useForm,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import {
  ElementLocation,
  ElementName,
  fireAnalyticsEvent,
} from '@spectrumlabs/analytics';
import findLast from 'lodash/findLast';
import maxBy from 'lodash/maxBy';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  skip,
  switchMap,
  zip,
} from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { useSearchParams } from '../../common/hooks/useSearchParams';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
import { testText$ } from '../../common/streams/appTick';
import { AssetControlFormItem } from '../../components/common/TokenControl/AssetControl';
import { IsErgo } from '../../components/IsErgo/IsErgo';
import {
  OperationForm,
  OperationLoader,
  OperationValidator,
} from '../../components/OperationForm/OperationForm';
import { Page } from '../../components/Page/Page';
import {
  EventProducerContext,
  fireOperationAnalyticsEvent,
} from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { ammPools$, getAmmPoolsByAssetPair } from '../../gateway/api/ammPools';
import { useAssetsBalance } from '../../gateway/api/assetBalance';
import {
  defaultTokenAssets$,
  getAssetToImportFor,
  getDefaultAssetsFor,
  getImportedAssetsFor,
  importedTokenAssets$,
  tokenAssetsToImport$,
} from '../../gateway/api/assets';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { swap } from '../../gateway/api/operations/swap';
import { useHandleSwapMaxButtonClick } from '../../gateway/api/useHandleSwapMaxButtonClick';
import { useSwapValidators } from '../../gateway/api/validationFees';
import { useSelectedNetwork } from '../../gateway/common/network.ts';
import { useSettings } from '../../gateway/settings/settings';
import { operationsSettings$ } from '../../gateway/widgets/operationsSettings';
import { swapCollapse$ } from '../../gateway/widgets/swapCallapse.ts';
import { useGuardV2 } from '../../hooks/useGuard.ts';
import { mapToSwapAnalyticsProps } from '../../utils/analytics/mapper';
import { isPreLbspTimeGap } from '../../utils/lbsp.ts';
import { PriceImpactWarning } from './PriceImpactWarning/PriceImpactWarning';
import { SwapFormModel } from './SwapFormModel';
import { SwapGraph } from './SwapGraph/SwapGraph';
import { SwitchButton } from './SwitchButton/SwitchButton';
import { YieldFarmingBadge } from './YieldFarmingBadge/YieldFarmingBadge';

const swapParamsCache$ = new BehaviorSubject<
  | undefined
  | {
      base: string | undefined;
      quote: string | undefined;
      initialPoolId: string | undefined;
    }
>(undefined);

const getToAssets = (fromAsset?: string) =>
  fromAsset ? getDefaultAssetsFor(fromAsset) : defaultTokenAssets$;

const getToAssetsToImport = (fromAsset?: string) =>
  fromAsset ? getAssetToImportFor(fromAsset) : tokenAssetsToImport$;

const getToImportedAssets = (fromAsset?: string) =>
  fromAsset ? getImportedAssetsFor(fromAsset) : importedTokenAssets$;

const isAssetsPairEquals = (
  [prevFrom, prevTo]: [AssetInfo | undefined, AssetInfo | undefined],
  [nextFrom, nextTo]: [AssetInfo | undefined, AssetInfo | undefined],
) =>
  (prevFrom?.id === nextFrom?.id && prevTo?.id === nextTo?.id) ||
  (prevFrom?.id === nextTo?.id && prevTo?.id === nextFrom?.id);

const getAvailablePools = (xId?: string, yId?: string): Observable<AmmPool[]> =>
  xId && yId ? getAmmPoolsByAssetPair(xId, yId) : of([]);

export const Swap = (): JSX.Element => {
  const [testText] = useObservable(testText$);
  const [SwapCollapse] = useObservable(swapCollapse$);
  const [selectedNetwork] = useSelectedNetwork();
  const { slippage } = useSettings();
  const navigate = useNavigate();
  useGuardV2(
    () => selectedNetwork.name !== 'ergo' && isPreLbspTimeGap(),
    () => navigate(`/../../../../liquidity`),
  );

  const form = useForm<SwapFormModel>({
    fromAmount: undefined,
    toAmount: undefined,
    fromAsset: undefined,
    toAsset: undefined,
    pool: undefined,
  });
  const [leftWidgetOpened, setLeftWidgetOpened] = useState<boolean>(false);
  const [lastEditedField, setLastEditedField] = useState<'from' | 'to'>('from');
  const [networkAsset] = useNetworkAsset();
  const [balance] = useAssetsBalance();
  const [, allAmmPoolsLoading] = useObservable(ammPools$);
  const swapNetworkValidators = useSwapValidators();
  const handleSwapMaxButtonClick = useHandleSwapMaxButtonClick();
  const [{ base, quote, initialPoolId }, setSearchParams] =
    useSearchParams<{ base: string; quote: string; initialPoolId: string }>();
  const [OperationSettings] = useObservable(operationsSettings$);
  const [reversedRatio, setReversedRatio] = useState(false);
  const [isPriceImpactHeight] = useObservable(
    form.valueChanges$.pipe(
      map((value) => {
        if (!!value.pool && !!value.fromAmount) {
          return value.pool.calculatePriceImpact(value.fromAmount);
        } else {
          return 0;
        }
      }),
      map((priceImpact) => priceImpact > 5),
      distinctUntilChanged(),
      publishReplay(1),
      refCount(),
    ),
  );

  const updateToAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const toAssets$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getToAssets)),
    [],
  );
  const toAssetsToImport$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getToAssetsToImport)),
    [],
  );
  const toImportedAssets$ = useMemo(
    () => updateToAssets$.pipe(switchMap(getToImportedAssets)),
    [],
  );

  const insufficientFromForTxValidator: OperationValidator<SwapFormModel> = ({
    value: { fromAsset, fromAmount },
  }) => {
    if (fromAsset && fromAmount && fromAmount.gt(balance.get(fromAsset))) {
      return t`Insufficient ${fromAsset.ticker} Balance`;
    }
    return undefined;
  };

  const amountEnteredValidator: OperationValidator<SwapFormModel> = ({
    value: { toAmount, fromAmount },
  }: FormGroup<SwapFormModel>) => {
    if (
      (!fromAmount?.isPositive() && toAmount?.isPositive()) ||
      (!toAmount?.isPositive() && fromAmount?.isPositive())
    ) {
      return undefined;
    }

    return !fromAmount?.isPositive() || !toAmount?.isPositive()
      ? t`Enter an Amount`
      : undefined;
  };

  const minValueForTokenValidator: OperationValidator<SwapFormModel> = (
    form,
  ) => {
    const {
      value: { pool, toAmount, fromAsset, toAsset, fromAmount },
    } = form;

    if (!pool || !toAsset || !fromAsset) {
      return undefined;
    }
    if (lastEditedField === 'from') {
      const minValue = pool.calculateInputAmount(
        new Currency(1n, toAsset),
        slippage,
      );

      return !fromAmount?.isPositive() ||
        (fromAmount && minValue.gt(fromAmount))
        ? {
            content: t`Min value for ${
              minValue.asset.ticker
            } is ${minValue.toString()}`,
            action: () => form.controls.fromAmount.patchValue(minValue),
          }
        : undefined;
    } else {
      const minValue = pool.calculateOutputAmount(
        new Currency(1n, fromAsset),
        slippage,
      );

      return !toAmount?.isPositive() || (toAmount && minValue.gt(toAmount))
        ? {
            content: t`Min value for ${
              minValue.asset.ticker
            } is ${minValue.toString()}`,
            action: () => form.controls.toAmount.patchValue(minValue),
          }
        : undefined;
    }
  };

  const tokensNotSelectedValidator: OperationValidator<SwapFormModel> = ({
    value: { toAsset, fromAsset },
  }: FormGroup<SwapFormModel>) =>
    !toAsset || !fromAsset ? t`Select a token` : undefined;

  const isPoolLoading: OperationLoader<SwapFormModel> = ({
    value: { fromAsset, toAsset, pool },
  }) => !!fromAsset && !!toAsset && !pool;

  const submitSwap = ({ value }: FormGroup<SwapFormModel>) => {
    swap(value as Required<SwapFormModel>)
      .pipe(first())
      .subscribe(() => resetForm());

    fireOperationAnalyticsEvent(
      'Swap Form Submit',
      (ctx: EventProducerContext) => mapToSwapAnalyticsProps(value, ctx),
    );
  };

  const resetForm = () =>
    form.patchValue(
      { fromAmount: undefined, toAmount: undefined },
      { emitEvent: 'silent' },
    );

  const insufficientLiquidityValidator: OperationValidator<SwapFormModel> = ({
    value: { toAmount, pool },
  }) => {
    if (!toAmount?.isPositive() || !pool) {
      return false;
    }
    return toAmount?.gte(pool.getAssetAmount(toAmount?.asset))
      ? t`Insufficient liquidity for this trade`
      : undefined;
  };

  useSubscription(
    zip([defaultTokenAssets$, tokenAssetsToImport$, importedTokenAssets$]).pipe(
      first(),
      map(([defaultTokenAssets, tokenAssetsToImport, importedTokenAssets]) => [
        ...defaultTokenAssets,
        ...tokenAssetsToImport,
        ...importedTokenAssets,
      ]),
    ),
    (assets) => {
      if (!form.value.fromAsset && !form.value.toAsset) {
        form.patchValue({
          fromAsset:
            findLast(
              assets,
              (a) => a.id === (base || swapParamsCache$.getValue()?.base),
            ) || networkAsset,
          toAsset: findLast(
            assets,
            (a) => a.id === (quote || swapParamsCache$.getValue()?.quote),
          ),
        });
      }
    },
    [],
  );

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
      if (form.value.toAsset || form.value.fromAsset) {
        setSearchParams({
          quote: form.value.toAsset?.id,
          base: form.value.fromAsset?.id,
        });
        swapParamsCache$.next({
          initialPoolId: undefined,
          quote: form.value.toAsset?.id,
          base: form.value.fromAsset?.id,
        });
      }
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

      let newPool: AmmPool | undefined;

      if (!form.value.pool && initialPoolId) {
        newPool =
          pools.find(
            (p) =>
              p.id ===
              (swapParamsCache$.getValue()?.initialPoolId || initialPoolId),
          ) || maxBy(pools, (p) => p.x.amount * p.y.amount);
      } else {
        newPool =
          pools.find((p) => p.id === form.value.pool?.id) ||
          maxBy(pools, (p) => p.x.amount * p.y.amount);
      }
      if (
        !form.value.pool?.x.isEquals(newPool?.x) ||
        !form.value.pool?.y.isEquals(newPool?.y)
      ) {
        form.patchValue({ pool: newPool });
      }
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
      const { fromAmount, toAmount, fromAsset, toAsset, pool } = form.value;

      if (!pool) {
        return;
      }

      setSearchParams({
        base: fromAsset?.id,
        quote: toAsset?.id,
        initialPoolId: pool?.id,
      });
      swapParamsCache$.next({
        base: fromAsset?.id,
        quote: toAsset?.id,
        initialPoolId: pool?.id,
      });

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
    fireAnalyticsEvent('Swap Click Switch');
  };

  const [pool] = useObservable(form.controls.pool.valueChangesWithSilent$);
  const [fromAsset] = useObservable(
    form.controls.fromAsset.valueChangesWithSilent$,
  );
  const validators: OperationValidator<SwapFormModel>[] = useMemo(
    () => [
      tokensNotSelectedValidator,
      amountEnteredValidator,
      insufficientLiquidityValidator,
      minValueForTokenValidator,
      insufficientFromForTxValidator,
      ...swapNetworkValidators,
    ],
    [balance, lastEditedField],
  );

  const loaders = useMemo(() => [isPoolLoading], []);

  // @ts-ignore
  return (
    <Page
      maxWidth={500}
      widgetBaseHeight={pool ? 432 : 272}
      footer={
        <IsErgo>
          <YieldFarmingBadge />
        </IsErgo>
      }
      leftWidget={
        <SwapGraph
          pool={pool}
          isReversed={reversedRatio}
          setReversed={setReversedRatio}
          fromAsset={fromAsset}
        />
      }
      widgetOpened={leftWidgetOpened}
      onWidgetClose={() => setLeftWidgetOpened(false)}
    >
      <OperationForm
        traceFormLocation={ElementLocation.swapForm}
        isWarningButton={isPriceImpactHeight}
        actionCaption={t`Swap`}
        form={form}
        onSubmit={submitSwap}
        validators={validators}
        loaders={loaders}
      >
        <Flex col>
          <Flex row align="center">
            <Flex.Item flex={1}>
              <Typography.Title level={4}>
                <Trans>Swap</Trans> {testText}
              </Typography.Title>
            </Flex.Item>
            <Button
              type="text"
              size="large"
              icon={<LineChartOutlined />}
              onClick={() => setLeftWidgetOpened(!leftWidgetOpened)}
            />
            {OperationSettings && <OperationSettings />}
          </Flex>
          <Flex.Item marginBottom={1} marginTop={2}>
            <AssetControlFormItem
              loading={allAmmPoolsLoading}
              bordered
              maxButton
              handleMaxButtonClick={handleSwapMaxButtonClick}
              assets$={defaultTokenAssets$}
              assetsToImport$={tokenAssetsToImport$}
              importedAssets$={importedTokenAssets$}
              amountName="fromAmount"
              tokenName="fromAsset"
              trace={{
                element_name: ElementName.tokenFrom,
                element_location: ElementLocation.swapForm,
              }}
            />
          </Flex.Item>
          <SwitchButton
            onClick={switchAssets}
            icon={<SwapOutlined />}
            size="middle"
          />
          <Flex.Item>
            <Form.Listener>
              {({ value }) => (
                <AssetControlFormItem
                  loading={allAmmPoolsLoading}
                  bordered
                  assets$={toAssets$}
                  assetsToImport$={toAssetsToImport$}
                  importedAssets$={toImportedAssets$}
                  amountName="toAmount"
                  tokenName="toAsset"
                  trace={{
                    element_name: ElementName.tokenTo,
                    element_location: ElementLocation.swapForm,
                  }}
                  priceImpact={
                    value.pool && value.fromAmount
                      ? value.pool.calculatePriceImpact(value.fromAmount)
                      : undefined
                  }
                />
              )}
            </Form.Listener>
          </Flex.Item>
          <Form.Listener>
            {({ value }) => (
              <>
                {value.fromAmount && value.toAmount && (
                  <Flex.Item marginTop={2}>
                    {SwapCollapse && <SwapCollapse value={value} />}
                  </Flex.Item>
                )}
              </>
            )}
          </Form.Listener>
          {isPriceImpactHeight && (
            <Flex.Item marginTop={4}>
              <PriceImpactWarning />
            </Flex.Item>
          )}
        </Flex>
      </OperationForm>
    </Page>
  );
};
