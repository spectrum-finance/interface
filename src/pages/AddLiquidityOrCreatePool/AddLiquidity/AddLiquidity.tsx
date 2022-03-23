import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { t } from '@lingui/macro';
import { maxBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { skip } from 'rxjs';

import { useAssetsBalance } from '../../../api/assetBalance';
import { useSubscription } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import {
  OperationForm,
  OperationValidator,
} from '../../../components/OperationForm/OperationForm';
import { Section } from '../../../components/Section/Section';
import {
  Button,
  Flex,
  Form,
  FormGroup,
  PlusOutlined,
  useForm,
} from '../../../ergodex-cdk';
import { useMaxTotalFees, useNetworkAsset } from '../../../services/new/core';
import { PoolRatio } from '../../PoolOverview/PoolRatio/PoolRatio';
import { normalizeAmountWithFee } from '../common/utils';
import { LiquidityPercentInput } from '../LiquidityPercentInput/LiquidityPercentInput';
import { AddLiquidityConfirmationModal } from './AddLiquidityConfirmationModal/AddLiquidityConfirmationModal';
import { AddLiquidityFormModel } from './AddLiquidityFormModel';
import { PoolSelector } from './PoolSelector/PoolSelector';

export interface AddLiquidityProps {
  readonly xAsset?: AssetInfo;
  readonly yAsset?: AssetInfo;
  readonly pools: AmmPool[];
  readonly onNewPoolButtonClick?: () => void;
}

export const AddLiquidity: FC<AddLiquidityProps> = ({
  pools,
  xAsset,
  yAsset,
  onNewPoolButtonClick,
}) => {
  const [lastEditedField, setLastEditedField] = useState<'x' | 'y'>('x');
  const [balance] = useAssetsBalance();
  const totalFees = useMaxTotalFees();
  const networkAsset = useNetworkAsset();
  const form = useForm<AddLiquidityFormModel>({
    xAsset,
    yAsset,
    x: undefined,
    y: undefined,
    pool: undefined,
  });

  useEffect(() => {
    if (form.value.xAsset?.id !== xAsset?.id) {
      // TODO: CHANGE_TOKEN_INPUT_BEHAVIOR
      form.patchValue(
        {
          xAsset,
          x:
            lastEditedField === 'x' && xAsset
              ? form.value.x?.changeAsset(xAsset)
              : undefined,
        },
        { emitEvent: 'silent' },
      );
    }
  }, [xAsset?.id]);

  useEffect(() => {
    if (form.value.yAsset?.id !== yAsset?.id) {
      // TODO: CHANGE_TOKEN_INPUT_BEHAVIOR
      form.patchValue(
        {
          yAsset,
          y:
            lastEditedField === 'y' && yAsset
              ? form.value.y?.changeAsset(yAsset)
              : undefined,
        },
        { emitEvent: 'silent' },
      );
    }
  }, [yAsset?.id]);

  useEffect(() => {
    if (!pools) {
      return;
    }
    const poolWithHighestLiquidity = maxBy(
      pools,
      (p) => p.x.amount * p.y.amount,
    );

    if (!!form.value.pool?.id) {
      form.patchValue({
        pool:
          pools.find((p) => p.id === form.value.pool?.id) ||
          poolWithHighestLiquidity,
      });
    } else {
      form.patchValue({ pool: poolWithHighestLiquidity });
    }
  }, [pools]);

  useSubscription(form.controls.x.valueChanges$.pipe(skip(1)), (value) => {
    setLastEditedField('x');

    if (form.value.pool && value) {
      form.controls.y.patchValue(
        form.value.pool.calculateDepositAmount(value),
        { emitEvent: 'silent' },
      );
    } else {
      form.controls.y.patchValue(undefined, { emitEvent: 'silent' });
    }
  });

  useSubscription(form.controls.y.valueChanges$.pipe(skip(1)), (value) => {
    setLastEditedField('y');

    if (form.value.pool && value) {
      form.controls.x.patchValue(
        form.value.pool.calculateDepositAmount(value),
        { emitEvent: 'silent' },
      );
    } else {
      form.controls.x.patchValue(undefined, { emitEvent: 'silent' });
    }
  });

  useSubscription(
    form.controls.pool.valueChanges$,
    () => {
      const { x, y, pool } = form.value;

      if (!pool) {
        return;
      }

      if (lastEditedField === 'x' && x && x.isPositive()) {
        form.controls.y.patchValue(pool.calculateDepositAmount(x), {
          emitEvent: 'silent',
        });
      }

      if (lastEditedField === 'y' && y && y.isPositive()) {
        form.controls.x.patchValue(pool.calculateDepositAmount(y), {
          emitEvent: 'silent',
        });
      }
    },
    [lastEditedField],
  );

  const insufficientFeeValidator: OperationValidator<AddLiquidityFormModel> = ({
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

  const balanceValidator: OperationValidator<AddLiquidityFormModel> = ({
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

  const amountValidator: OperationValidator<AddLiquidityFormModel> = ({
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

  const minValueValidator: OperationValidator<AddLiquidityFormModel> = ({
    value: { xAsset, yAsset, x, y, pool },
  }) => {
    let c: Currency | undefined;
    if (!x?.isPositive() && y?.isPositive() && pool) {
      c = pool.calculateDepositAmount(new Currency(1n, xAsset)).plus(1n);
    }
    if (!y?.isPositive() && x?.isPositive() && pool) {
      c = pool.calculateDepositAmount(new Currency(1n, yAsset));
    }
    return c && t`Min value for ${c?.asset.name} is ${c?.toString()}`;
  };

  const selectTokenValidator: OperationValidator<AddLiquidityFormModel> = ({
    value: { pool },
  }) => !pool && t`Select a token`;

  const resetForm = () =>
    form.patchValue(
      {
        x: undefined,
        y: undefined,
      },
      { emitEvent: 'silent' },
    );

  const addLiquidityAction = ({ value }: FormGroup<AddLiquidityFormModel>) => {
    openConfirmationModal(
      (next) => {
        return (
          <AddLiquidityConfirmationModal
            value={value as Required<AddLiquidityFormModel>}
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
    const { xAsset, yAsset, pool } = form.value;

    if (!xAsset || !yAsset || !pool) {
      return;
    }

    let newXAmount = normalizeAmountWithFee(
      balance.get(xAsset).percent(pct),
      balance.get(xAsset),
      networkAsset,
      totalFees,
    );
    let newYAmount = normalizeAmountWithFee(
      pool.calculateDepositAmount(newXAmount),
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
    newXAmount = normalizeAmountWithFee(
      pool.calculateDepositAmount(newYAmount),
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
      form.patchValue(
        {
          x: balance.get(xAsset).percent(pct),
          y: pool.calculateDepositAmount(balance.get(xAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
      return;
    } else {
      form.patchValue(
        {
          y: balance.get(yAsset).percent(pct),
          x: pool.calculateDepositAmount(balance.get(yAsset).percent(pct)),
        },
        { emitEvent: 'silent' },
      );
    }
  };

  const validators: OperationValidator<AddLiquidityFormModel>[] = [
    selectTokenValidator,
    amountValidator,
    minValueValidator,
    balanceValidator,
    insufficientFeeValidator,
  ];

  return (
    <OperationForm
      form={form}
      onSubmit={addLiquidityAction}
      validators={validators}
      actionCaption={t`Add Liquidity`}
    >
      <Flex col>
        <Flex.Item marginBottom={4}>
          <Section title={t`Pool`}>
            <Flex>
              <Flex.Item marginRight={1} flex={1}>
                <Form.Item name="pool">
                  {({ value, onChange }) => (
                    <PoolSelector
                      ammPools={pools}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Form.Item>
              </Flex.Item>
              <Button
                size="large"
                onClick={onNewPoolButtonClick}
                icon={<PlusOutlined style={{ fontSize: 20 }} />}
              />
            </Flex>
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
              <Flex.Item marginBottom={2}>
                <TokenControlFormItem
                  amountName="x"
                  tokenName="xAsset"
                  readonly="asset"
                />
              </Flex.Item>
              <Flex.Item>
                <TokenControlFormItem
                  amountName="y"
                  tokenName="yAsset"
                  readonly="asset"
                />
              </Flex.Item>
            </Flex>
          </Section>
        </Flex.Item>
        <Form.Listener>
          {({ value }) =>
            value.pool && (
              <Flex.Item justify="center">
                <Flex.Item flex={1} marginRight={2}>
                  <PoolRatio ammPool={value.pool} ratioOf="x" />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <PoolRatio ammPool={value.pool} ratioOf="y" />
                </Flex.Item>
              </Flex.Item>
            )
          }
        </Form.Listener>
      </Flex>
    </OperationForm>
  );
};
