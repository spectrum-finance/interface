import { Animation, Flex, Form, FormGroup, useForm } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC, useMemo, useState } from 'react';
import { BehaviorSubject, first, map, of, skip, switchMap } from 'rxjs';

import {
  useObservable,
  useSubscription,
} from '../../common/hooks/useObservable';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
import { Ratio } from '../../common/models/Ratio';
import { LiquidityPercentInput } from '../../components/AddLiquidityForm/LiquidityPercentInput/LiquidityPercentInput';
import { AssetControlFormItem } from '../../components/common/TokenControl/AssetControl';
import { AssetSelectFormItem } from '../../components/common/TokenControl/AssetSelect/AssetSelect';
import { IsErgo } from '../../components/IsErgo/IsErgo';
import {
  OperationForm,
  OperationValidator,
} from '../../components/OperationForm/OperationForm';
import { Page } from '../../components/Page/Page';
import { RatioBox } from '../../components/RatioBox/RatioBox';
import { Section } from '../../components/Section/Section';
import {
  assetBalance$,
  useAssetsBalance,
} from '../../gateway/api/assetBalance';
import { useNetworkAsset } from '../../gateway/api/networkAsset';
import { createPool } from '../../gateway/api/operations/createPool';
import { useCreatePoolValidators } from '../../gateway/api/validationFees';
import { selectedNetwork$ } from '../../gateway/common/network';
import { operationsSettings$ } from '../../gateway/widgets/operationsSettings';
import { CreatePoolFormModel } from './CreatePoolFormModel';
import { FeeSelector } from './FeeSelector/FeeSelector';
import { InitialPriceInput } from './InitialPrice/InitialPriceInput';
import { Overlay } from './Overlay/Overlay';

const xAssets$ = selectedNetwork$.pipe(
  switchMap((network) => {
    if (network.name === 'ergo') {
      return assetBalance$.pipe(
        map((balance) => balance.values().map((balance) => balance.asset)),
      );
    }
    return of([network.networkAsset]);
  }),
);

const getYAssets = (xId?: string) => {
  return selectedNetwork$.pipe(
    switchMap((network) => {
      if (network.name === 'ergo') {
        return xId
          ? xAssets$.pipe(map((assets) => assets.filter((a) => a.id !== xId)))
          : xAssets$;
      }
      return assetBalance$.pipe(
        map((balance) => balance.values().map((balance) => balance.asset)),
        map((assets) => assets.filter((a) => a.id !== network.networkAsset.id)),
      );
    }),
  );
};

export const CreatePool: FC = () => {
  const [OperationSettings] = useObservable(operationsSettings$);
  const [networkAsset] = useNetworkAsset();
  const [lastEditedField, setLastEditedField] = useState<'x' | 'y'>('x');
  const createPoolValidators = useCreatePoolValidators();
  const [balance] = useAssetsBalance();
  const form = useForm<CreatePoolFormModel>({
    initialPrice: undefined,
    x: undefined,
    xAsset: networkAsset,
    yAsset: undefined,
    y: undefined,
    fee: undefined,
  });
  const [createPoolFormValue] = useObservable(form.valueChangesWithSilent$, []);

  const updateYAssets$ = useMemo(
    () => new BehaviorSubject<string | undefined>(undefined),
    [],
  );
  const yAssets$ = useMemo(
    () => updateYAssets$.pipe(switchMap(getYAssets)),
    [],
  );

  const getMainRatio = (ratio: Ratio, xAsset: AssetInfo) =>
    ratio.baseAsset.id === xAsset.id ? ratio : ratio.invertRatio();

  const getOppositeRatio = (ratio: Ratio, yAsset: AssetInfo) =>
    ratio.baseAsset.id === yAsset.id ? ratio : ratio.invertRatio();

  const handleXChange = (x: Currency | undefined) => {
    if (lastEditedField !== 'x') {
      setLastEditedField('x');
    }

    const { initialPrice } = form.value;

    if (!x) {
      form.patchValue({ y: undefined }, { emitEvent: 'silent' });
      return;
    }
    if (!initialPrice) {
      form.patchValue({ y: undefined }, { emitEvent: 'silent' });
      return;
    }

    const ratio: Ratio =
      initialPrice.quoteAsset.id === x?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();

    form.patchValue(
      {
        y: ratio.toBaseCurrency(x),
      },
      { emitEvent: 'silent' },
    );
  };

  const handleYChange = (y: Currency | undefined) => {
    if (lastEditedField !== 'y') {
      setLastEditedField('y');
    }

    const { initialPrice } = form.value;

    if (!y) {
      form.patchValue({ x: undefined }, { emitEvent: 'silent' });
      return;
    }
    if (!initialPrice) {
      form.patchValue({ x: undefined }, { emitEvent: 'silent' });
      return;
    }

    const ratio: Ratio =
      initialPrice.quoteAsset.id === y?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();

    form.patchValue(
      {
        x: ratio.toBaseCurrency(y),
      },
      { emitEvent: 'silent' },
    );
  };

  const resetForm = () =>
    form.patchValue(
      {
        x: undefined,
        y: undefined,
      },
      { emitEvent: 'silent' },
    );

  const createPoolAction = ({ value }: FormGroup<CreatePoolFormModel>) => {
    createPool(value as Required<CreatePoolFormModel>)
      .pipe(first())
      .subscribe(() => resetForm());
    // fireOperationAnalyticsEvent('Deposit Form Submit', (ctx) =>
    //   mapToDepositAnalyticsProps(value, ctx),
    // );
  };

  useSubscription(
    form.controls.xAsset.valueChangesWithSilent$,
    (asset: AssetInfo | undefined) => updateYAssets$.next(asset?.id),
  );

  useSubscription(
    form.controls.xAsset.valueChangesWithSilent$,
    (asset: AssetInfo | undefined) => {
      if (asset?.id === form.value.yAsset?.id) {
        form.patchValue({
          yAsset: undefined,
          x: undefined,
          y: undefined,
          initialPrice: undefined,
        });
      }
    },
  );

  useSubscription(form.controls.x.valueChanges$.pipe(skip(1)), handleXChange, [
    lastEditedField,
  ]);

  useSubscription(form.controls.y.valueChanges$.pipe(skip(1)), handleYChange, [
    lastEditedField,
  ]);

  useSubscription(
    form.controls.initialPrice.valueChanges$.pipe(skip(1)),
    () => {
      const { y, x } = form.value;

      if (!y && !x) {
        return;
      }
      if (lastEditedField === 'x') {
        handleXChange(x);
      } else {
        handleYChange(y);
      }
    },
    [lastEditedField],
  );

  const selectTokenValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { xAsset, yAsset },
  }) => (!xAsset || !yAsset ? t`Select a token` : undefined);

  const feeValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { fee },
  }) => !fee && t`Select a fee tier`;

  const initialPriceValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { initialPrice },
  }) => !initialPrice?.isPositive() && t`Enter an Initial Price`;

  const amountValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { x, y },
  }) => {
    if (
      (!x?.isPositive() && y?.isPositive()) ||
      (!y?.isPositive() && x?.isPositive())
    ) {
      return undefined;
    }

    return (!x?.isPositive() || !y?.isPositive()) && t`Enter an Amount`;
  };

  const minValueValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { x, y, initialPrice, xAsset, yAsset },
  }): string | undefined => {
    let c: Currency | undefined;

    if (!x?.isPositive() && y?.isPositive() && initialPrice && xAsset) {
      c =
        initialPrice.quoteAsset.id === xAsset.id
          ? initialPrice.toBaseCurrency(new Currency(1n, xAsset))
          : initialPrice.toQuoteCurrency(new Currency(1n, xAsset));
    }
    if (!y?.isPositive() && x?.isPositive() && initialPrice && yAsset) {
      c =
        initialPrice.quoteAsset.id === yAsset.id
          ? initialPrice.toBaseCurrency(new Currency(1n, yAsset))
          : initialPrice.toQuoteCurrency(new Currency(1n, yAsset));
    }
    return c
      ? t`Min value for ${c?.asset.ticker} is ${c?.toString()}`
      : undefined;
  };

  const balanceValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { x, y },
  }) => {
    if (x?.gt(balance.get(x?.asset))) {
      return t`Insufficient ${x?.asset.ticker} Balance`;
    }

    if (y?.gt(balance.get(y?.asset))) {
      return t`Insufficient ${y?.asset.ticker} Balance`;
    }

    return undefined;
  };

  const validators: OperationValidator<CreatePoolFormModel>[] = useMemo(
    () => [
      selectTokenValidator,
      feeValidator,
      initialPriceValidator,
      amountValidator,
      minValueValidator,
      balanceValidator,
      ...createPoolValidators,
    ],
    [balance, lastEditedField],
  );

  const handleMaxLiquidityClick = (pct: number) => {
    // const { xAsset, yAsset, initialPrice } = form.value;
    //
    // if (!xAsset || !yAsset || !initialPrice) {
    //   return;
    // }
    //
    // let newXAmount = normalizeAmountWithFee(
    //   balance.get(xAsset).percent(pct),
    //   balance.get(xAsset),
    //   networkAsset,
    //   totalFees,
    // );
    // let ratio: Ratio =
    //   initialPrice.quoteAsset.id === newXAmount?.asset.id
    //     ? initialPrice
    //     : initialPrice.invertRatio();
    // let newYAmount = normalizeAmountWithFee(
    //   ratio.toBaseCurrency(newXAmount),
    //   balance.get(yAsset),
    //   networkAsset,
    //   totalFees,
    // );
    //
    // if (
    //   newXAmount.isPositive() &&
    //   newYAmount.isPositive() &&
    //   newYAmount.lte(balance.get(yAsset))
    // ) {
    //   form.patchValue(
    //     {
    //       x: newXAmount,
    //       y: newYAmount,
    //     },
    //     { emitEvent: 'silent' },
    //   );
    //   return;
    // }
    //
    // newYAmount = normalizeAmountWithFee(
    //   balance.get(yAsset).percent(pct),
    //   balance.get(yAsset),
    //   networkAsset,
    //   totalFees,
    // );
    // ratio =
    //   initialPrice.quoteAsset.id === newYAmount?.asset.id
    //     ? initialPrice
    //     : initialPrice.invertRatio();
    // newXAmount = normalizeAmountWithFee(
    //   ratio.toBaseCurrency(newYAmount),
    //   balance.get(xAsset),
    //   networkAsset,
    //   totalFees,
    // );
    //
    // if (
    //   newYAmount.isPositive() &&
    //   newXAmount.isPositive() &&
    //   newXAmount.lte(balance.get(xAsset))
    // ) {
    //   form.patchValue(
    //     {
    //       x: newXAmount,
    //       y: newYAmount,
    //     },
    //     { emitEvent: 'silent' },
    //   );
    //   return;
    // }
    //
    // if (balance.get(xAsset).isPositive()) {
    //   ratio =
    //     initialPrice.quoteAsset.id === xAsset.id
    //       ? initialPrice
    //       : initialPrice.invertRatio();
    //
    //   form.patchValue(
    //     {
    //       x: balance.get(xAsset).percent(pct),
    //       y: ratio.toBaseCurrency(balance.get(xAsset).percent(pct)),
    //     },
    //     { emitEvent: 'silent' },
    //   );
    //   return;
    // } else {
    //   ratio =
    //     initialPrice.quoteAsset.id === yAsset.id
    //       ? initialPrice
    //       : initialPrice.invertRatio();
    //
    //   form.patchValue(
    //     {
    //       y: balance.get(yAsset).percent(pct),
    //       x: ratio.toBaseCurrency(balance.get(yAsset).percent(pct)),
    //     },
    //     { emitEvent: 'silent' },
    //   );
    // }
  };

  return (
    <Page
      title={<Trans>Create pool</Trans>}
      maxWidth={510}
      withBackButton
      backTo="../../../liquidity"
      padding={4}
    >
      <OperationForm
        form={form}
        onSubmit={createPoolAction}
        actionCaption={t`Create pool`}
        validators={validators}
        traceFormLocation={ElementLocation.createPoolForm}
      >
        <Flex col>
          <Flex.Item marginBottom={4} display="flex" col>
            <Section
              title={t`Select Pair`}
              gap={2}
              extra={
                <IsErgo>
                  {OperationSettings && (
                    <OperationSettings hideNitro hideSlippage />
                  )}
                </IsErgo>
              }
            >
              <Flex justify="center" align="center">
                <Flex.Item marginRight={2} flex={1}>
                  <AssetSelectFormItem
                    name="xAsset"
                    assets$={xAssets$}
                    trace={{
                      element_name: ElementName.tokenX,
                      element_location: ElementLocation.createPoolForm,
                    }}
                  />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <AssetSelectFormItem
                    name="yAsset"
                    assets$={yAssets$}
                    trace={{
                      element_name: ElementName.tokenY,
                      element_location: ElementLocation.createPoolForm,
                    }}
                  />
                </Flex.Item>
              </Flex>
            </Section>
          </Flex.Item>
          <Overlay
            enabled={
              !createPoolFormValue?.xAsset || !createPoolFormValue?.yAsset
            }
          >
            <Flex col>
              <Flex.Item marginBottom={4}>
                <Section
                  title={t`Set a fee tier`}
                  tooltip={t`This percentage will represent the earnings all liquidity providers receive from swap fees.`}
                  tooltipWidth={250}
                >
                  <Form.Item name="fee">
                    {({ value, onChange }) => (
                      <FeeSelector value={value} onChange={onChange} />
                    )}
                  </Form.Item>
                </Section>
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <Form.Item name="initialPrice" watchForm>
                  {({ value, onChange, parent }) => (
                    <Animation.Expand
                      expanded={!!parent.value.xAsset && !!parent.value.yAsset}
                    >
                      <Section title={t`Set initial price`}>
                        <InitialPriceInput
                          xAsset={parent.value.xAsset}
                          yAsset={parent.value.yAsset}
                          onChange={onChange}
                          value={value}
                        />
                      </Section>
                    </Animation.Expand>
                  )}
                </Form.Item>
              </Flex.Item>
              <Flex.Item marginBottom={4}>
                <Section
                  title={t`Provide initial liquidity`}
                  extra={
                    <Flex justify="flex-end">
                      <LiquidityPercentInput
                        onClick={handleMaxLiquidityClick}
                      />
                    </Flex>
                  }
                >
                  <Flex col>
                    <Flex.Item marginBottom={1}>
                      <AssetControlFormItem
                        tokenName="xAsset"
                        amountName="x"
                        readonly="asset"
                        trace={{
                          element_name: ElementName.tokenX,
                          element_location: ElementLocation.createPoolForm,
                        }}
                      />
                    </Flex.Item>
                    <AssetControlFormItem
                      tokenName="yAsset"
                      amountName="y"
                      readonly="asset"
                      trace={{
                        element_name: ElementName.tokenY,
                        element_location: ElementLocation.createPoolForm,
                      }}
                    />
                  </Flex>
                </Section>
              </Flex.Item>
              <Form.Listener>
                {({ value }) =>
                  value.xAsset &&
                  value.yAsset && (
                    <Flex.Item justify="center">
                      <Flex.Item flex={1} marginRight={2}>
                        <RatioBox
                          mainAsset={value.xAsset}
                          oppositeAsset={value.yAsset}
                          ratio={
                            value.initialPrice
                              ? getMainRatio(value.initialPrice, value.xAsset)
                              : undefined
                          }
                        />
                      </Flex.Item>
                      <Flex.Item flex={1}>
                        <RatioBox
                          mainAsset={value.yAsset}
                          oppositeAsset={value.xAsset}
                          ratio={
                            value.initialPrice
                              ? getOppositeRatio(
                                  value.initialPrice,
                                  value.yAsset,
                                )
                              : undefined
                          }
                        />
                      </Flex.Item>
                    </Flex.Item>
                  )
                }
              </Form.Listener>
            </Flex>
          </Overlay>
        </Flex>
      </OperationForm>
    </Page>
  );
};
