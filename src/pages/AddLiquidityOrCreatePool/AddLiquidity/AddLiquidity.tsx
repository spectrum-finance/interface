import {
  Button,
  Flex,
  Form,
  FormGroup,
  PlusOutlined,
  useForm,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import maxBy from 'lodash/maxBy';
import React, { FC, useEffect, useState } from 'react';
import { first, skip } from 'rxjs';

import { panalytics } from '../../../common/analytics';
import { useSubscription } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { AssetInfo } from '../../../common/models/AssetInfo';
import { Currency } from '../../../common/models/Currency';
import { AssetControlFormItem } from '../../../components/common/TokenControl/AssetControl';
import { IsErgo } from '../../../components/IsErgo/IsErgo';
import {
  OperationForm,
  OperationValidator,
} from '../../../components/OperationForm/OperationForm';
import { PoolSelector } from '../../../components/PoolSelector/PoolSelector';
import { Section } from '../../../components/Section/Section';
import { useAssetsBalance } from '../../../gateway/api/assetBalance';
import { deposit } from '../../../gateway/api/operations/deposit';
import { useHandleDepositMaxButtonClick } from '../../../gateway/api/useHandleDepositMaxButtonClick';
import { useDepositValidators } from '../../../gateway/api/validationFees';
import { PoolRatio } from '../../PoolOverview/PoolRatio/PoolRatio';
import { LiquidityPercentInput } from '../LiquidityPercentInput/LiquidityPercentInput';
import { AddLiquidityFormModel } from './AddLiquidityFormModel';

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
  const _handleDepositMaxButtonClick = useHandleDepositMaxButtonClick();
  const depositValidators = useDepositValidators();
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

  const balanceValidator: OperationValidator<AddLiquidityFormModel> = ({
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
    return c && t`Min value for ${c?.asset.ticker} is ${c?.toString()}`;
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
    deposit(value as Required<AddLiquidityFormModel>)
      .pipe(first())
      .subscribe(() => resetForm());
    panalytics.submitDeposit(value);
  };

  const handleMaxLiquidityClick = (pct: number) => {
    const { xAsset, yAsset, pool } = form.value;

    if (!xAsset || !yAsset || !pool) {
      return;
    }
    const [newX, newY] = _handleDepositMaxButtonClick(pct, form.value, balance);
    form.patchValue(
      {
        x: newX,
        y: newY,
      },
      { emitEvent: 'silent' },
    );
  };

  const validators: OperationValidator<AddLiquidityFormModel>[] = [
    selectTokenValidator,
    amountValidator,
    minValueValidator,
    balanceValidator,
    ...depositValidators,
  ];

  return (
    <OperationForm
      analytics={{ location: 'add-liquidity' }}
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
                      afterSelectOverlayOpen={() =>
                        panalytics.clickPoolSelectDeposit()
                      }
                      afterAmmPoolSelected={(ammPool) =>
                        panalytics.selectPoolDeposit(ammPool)
                      }
                    />
                  )}
                </Form.Item>
              </Flex.Item>
              <IsErgo>
                <Button
                  size="large"
                  onClick={() => {
                    if (onNewPoolButtonClick) {
                      panalytics.clickCreatePoolDeposit();
                      onNewPoolButtonClick();
                    }
                  }}
                  icon={<PlusOutlined style={{ fontSize: 20 }} />}
                />
              </IsErgo>
            </Flex>
          </Section>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Section
            gap={2}
            title={t`Liquidity`}
            extra={
              <Flex justify="flex-end">
                <LiquidityPercentInput onClick={handleMaxLiquidityClick} />
              </Flex>
            }
          >
            <Flex col>
              <Flex.Item marginBottom={2}>
                <AssetControlFormItem
                  amountName="x"
                  tokenName="xAsset"
                  readonly="asset"
                />
              </Flex.Item>
              <Flex.Item>
                <AssetControlFormItem
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
