import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { maxBy } from 'lodash';
import React, { FC, useEffect } from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { OperationForm } from '../../../components/OperationForm/OperationForm';
import { Section } from '../../../components/Section/Section';
import {
  Button,
  Flex,
  Form,
  PlusOutlined,
  useForm,
} from '../../../ergodex-cdk';
import { AddLiquidityFormModel } from './AddLiquidityFormModel';
import { PoolSelector } from './PoolSelector/PoolSelector';

export interface AddLiquidityProps {
  readonly x?: AssetInfo;
  readonly y?: AssetInfo;
  readonly pools: AmmPool[];
  readonly onNewPoolButtonClick?: () => void;
}

export const AddLiquidity: FC<AddLiquidityProps> = ({
  pools,
  x,
  y,
  onNewPoolButtonClick,
}) => {
  const form = useForm<AddLiquidityFormModel>({
    x,
    y,
    xAmount: undefined,
    yAmount: undefined,
    pool: undefined,
  });

  useEffect(() => {
    if (form.value.x?.id !== x?.id) {
      form.patchValue({ x });
    }
  }, [x?.id]);

  useEffect(() => {
    if (form.value.y?.id !== y?.id) {
      form.patchValue({ y });
    }
  }, [y?.id]);

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

  return (
    <OperationForm
      form={form}
      onSubmit={() => {}}
      validators={[]}
      actionCaption="Add Liquidity"
    >
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
    </OperationForm>
  );
};
