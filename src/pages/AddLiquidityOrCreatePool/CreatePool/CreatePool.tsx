import { Flex, Form, FormGroup, useForm } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, useEffect, useState } from 'react';
import { skip } from 'rxjs';

import { useSubscription } from '../../../common/hooks/useObservable';
import { AssetInfo } from '../../../common/models/AssetInfo';
import { Currency } from '../../../common/models/Currency';
import { Ratio } from '../../../common/models/Ratio';
import { AssetControlFormItem } from '../../../components/common/TokenControl/AssetControl';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import {
  OperationForm,
  OperationValidator,
} from '../../../components/OperationForm/OperationForm';
import { RatioBox } from '../../../components/RatioBox/RatioBox';
import { Section } from '../../../components/Section/Section';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { useNetworkAsset } from '../../../gateway/api/networkAsset';
import { useMaxTotalFees } from '../../../services/new/core';
import { normalizeAmountWithFee } from '../common/utils';
import { LiquidityPercentInput } from '../LiquidityPercentInput/LiquidityPercentInput';
import { CreatePoolConfirmationModal } from './CreatePoolConfirmationModal/CreatePoolConfirmationModal';
import { CreatePoolFormModel } from './CreatePoolFormModel';
import { FeeSelector } from './FeeSelector/FeeSelector';
import { InitialPriceInput } from './InitialPrice/InitialPriceInput';

export interface CreatePoolProps {
  readonly xAsset?: AssetInfo;
  readonly yAsset?: AssetInfo;
}

export const CreatePool: FC<CreatePoolProps> = ({ xAsset, yAsset }) => {
  const [lastEditedField, setLastEditedField] = useState<'x' | 'y'>('x');
  const [balance] = useAssetsBalance();
  const [networkAsset] = useNetworkAsset();
  const totalFees = useMaxTotalFees();
  const form = useForm<CreatePoolFormModel>({
    initialPrice: undefined,
    x: undefined,
    xAsset,
    yAsset,
    y: undefined,
    fee: undefined,
  });

  useEffect(() => {
    if (xAsset?.id !== form.value.xAsset?.id) {
      form.patchValue(
        { xAsset, x: undefined, y: undefined },
        { emitEvent: 'silent' },
      );
    }
  }, [xAsset?.id]);

  useEffect(() => {
    if (yAsset?.id !== form.value.yAsset?.id) {
      form.patchValue(
        { yAsset, x: undefined, y: undefined },
        { emitEvent: 'silent' },
      );
    }
  }, [yAsset?.id]);

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
      ? t`Min value for ${c?.asset.name} is ${c?.toString()}`
      : undefined;
  };

  const balanceValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { x, y },
  }) => {
    if (x?.gt(balance.get(x?.asset))) {
      return t`Insufficient ${x?.asset.name} Balance`;
    }

    if (y?.gt(balance.get(y?.asset))) {
      return t`Insufficient ${y?.asset.name} Balance`;
    }

    return undefined;
  };

  const insufficientFeeValidator: OperationValidator<CreatePoolFormModel> = ({
    value: { x, y },
  }) => {
    let totalFeesWithAmount = x?.isAssetEquals(networkAsset)
      ? x?.plus(totalFees)
      : totalFees;

    totalFeesWithAmount = y?.isAssetEquals(networkAsset)
      ? totalFeesWithAmount.plus(y)
      : totalFees;

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? t`Insufficient ${networkAsset.name} Balance for Fees`
      : undefined;
  };

  const validators: OperationValidator<CreatePoolFormModel>[] = [
    selectTokenValidator,
    feeValidator,
    initialPriceValidator,
    amountValidator,
    minValueValidator,
    balanceValidator,
    insufficientFeeValidator,
  ];

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

  const resetForm = () =>
    form.patchValue(
      {
        x: undefined,
        y: undefined,
      },
      { emitEvent: 'silent' },
    );

  const createPoolAction = ({ value }: FormGroup<CreatePoolFormModel>) => {
    openConfirmationModal(
      (next) => {
        return (
          <CreatePoolConfirmationModal
            value={value as Required<CreatePoolFormModel>}
            onClose={(request: Promise<any>) =>
              next(
                request.then((tx) => {
                  resetForm();
                  return tx;
                }),
              )
            }
          />
        );
      },
      Operation.ADD_LIQUIDITY,
      {
        xAsset: value.x,
        yAsset: value.y,
      },
    );
  };

  const handleMaxLiquidityClick = (pct: number) => {
    const { xAsset, yAsset, initialPrice } = form.value;

    if (!xAsset || !yAsset || !initialPrice) {
      return;
    }

    let newXAmount = normalizeAmountWithFee(
      balance.get(xAsset).percent(pct),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );
    let ratio: Ratio =
      initialPrice.quoteAsset.id === newXAmount?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();
    let newYAmount = normalizeAmountWithFee(
      ratio.toBaseCurrency(newXAmount),
      balance.get(yAsset),
      networkAsset,
      totalFees,
    );

    if (
      newXAmount.isPositive() &&
      newYAmount.isPositive() &&
      newYAmount.lte(balance.get(yAsset))
    ) {
      form.patchValue(
        {
          x: newXAmount,
          y: newYAmount,
        },
        { emitEvent: 'silent' },
      );
      return;
    }

    newYAmount = normalizeAmountWithFee(
      balance.get(yAsset).percent(pct),
      balance.get(yAsset),
      networkAsset,
      totalFees,
    );
    ratio =
      initialPrice.quoteAsset.id === newYAmount?.asset.id
        ? initialPrice
        : initialPrice.invertRatio();
    newXAmount = normalizeAmountWithFee(
      ratio.toBaseCurrency(newYAmount),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );

    if (
      newYAmount.isPositive() &&
      newXAmount.isPositive() &&
      newXAmount.lte(balance.get(xAsset))
    ) {
      form.patchValue(
        {
          x: newXAmount,
          y: newYAmount,
        },
        { emitEvent: 'silent' },
      );
      return;
    }

    if (balance.get(xAsset).isPositive()) {
      ratio =
        initialPrice.quoteAsset.id === xAsset.id
          ? initialPrice
          : initialPrice.invertRatio();

      form.patchValue(
        {
          x: balance.get(xAsset).percent(pct),
          y: ratio.toBaseCurrency(balance.get(xAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
      return;
    } else {
      ratio =
        initialPrice.quoteAsset.id === yAsset.id
          ? initialPrice
          : initialPrice.invertRatio();

      form.patchValue(
        {
          y: balance.get(yAsset).percent(pct),
          x: ratio.toBaseCurrency(balance.get(yAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
    }
  };

  return (
    <OperationForm
      form={form}
      onSubmit={createPoolAction}
      actionCaption={t`Create pool`}
      validators={validators}
    >
      <Flex col>
        <Flex.Item marginBottom={4}>
          <Section
            title={t`Choose a fee`}
            tooltip={t`The % you will earn in fees`}
          >
            <Form.Item name="fee">
              {({ value, onChange }) => (
                <FeeSelector value={value} onChange={onChange} />
              )}
            </Form.Item>
          </Section>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Section title={t`Set initial price`}>
            <Form.Item name="initialPrice" watchForm>
              {({ value, onChange, parent }) => (
                <InitialPriceInput
                  xAsset={parent.value.xAsset}
                  yAsset={parent.value.yAsset}
                  onChange={onChange}
                  value={value}
                />
              )}
            </Form.Item>
          </Section>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Section
            title={t`Liquidity`}
            extra={
              <Flex justify="flex-end">
                <LiquidityPercentInput onClick={handleMaxLiquidityClick} />
              </Flex>
            }
          >
            <Flex col>
              <Flex.Item marginBottom={1}>
                <AssetControlFormItem
                  tokenName="xAsset"
                  amountName="x"
                  readonly="asset"
                />
              </Flex.Item>
              <AssetControlFormItem
                tokenName="yAsset"
                amountName="y"
                readonly="asset"
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
                        ? getOppositeRatio(value.initialPrice, value.yAsset)
                        : undefined
                    }
                  />
                </Flex.Item>
              </Flex.Item>
            )
          }
        </Form.Listener>
      </Flex>
    </OperationForm>
  );
};
