import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { maxBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { skip } from 'rxjs';

import { useSubscription } from '../../../common/hooks/useObservable';
import { AmmPool } from '../../../common/models/AmmPool';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import { OperationForm } from '../../../components/OperationForm/OperationForm';
import { Section } from '../../../components/Section/Section';
import {
  Button,
  Flex,
  Form,
  PlusOutlined,
  useForm,
} from '../../../ergodex-cdk';
import { PoolRatio } from '../../PoolOverview/PoolRatio/PoolRatio';
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
    const poolWithHighestLiquidity = maxBy(pools, (p) => p.lp.amount);

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

  return (
    <OperationForm
      form={form}
      onSubmit={() => {}}
      validators={[]}
      actionCaption="Add Liquidity"
    >
      <Flex col>
        <Flex.Item marginBottom={4}>
          <Section title="Pool">
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
          <Section title="Liquidity">
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
