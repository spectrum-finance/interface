import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC, useState } from 'react';
import { combineLatest, skip } from 'rxjs';

import { useSubscription } from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Ratio } from '../../../common/models/Ratio';
import { TokenControlFormItem } from '../../../components/common/TokenControl/TokenControl';
import { OperationForm } from '../../../components/OperationForm/OperationForm';
import { RatioBox } from '../../../components/RatioBox/RatioBox';
import { Section } from '../../../components/Section/Section';
import { Flex, Form, useForm } from '../../../ergodex-cdk';
import { FeeSelector } from './FeeSelector/FeeSelector';
import { InitialPriceInput } from './InitialPrice/InitialPriceInput';

export interface CreatePoolProps {
  readonly xAsset: AssetInfo;
  readonly yAsset: AssetInfo;
}

interface CreatePoolFormModel {
  readonly initialPrice?: Ratio;
  readonly x?: Currency;
  readonly y?: Currency;
  readonly xAsset: AssetInfo;
  readonly yAsset: AssetInfo;
  readonly fee?: number;
}

export const CreatePool: FC<CreatePoolProps> = ({ xAsset, yAsset }) => {
  const [lastEditedField, setLastEditedField] = useState<'x' | 'y'>('x');
  const form = useForm<CreatePoolFormModel>({
    initialPrice: undefined,
    x: undefined,
    xAsset,
    yAsset,
    y: undefined,
    fee: undefined,
  });

  const getMainRatio = (ratio: Ratio, xAsset: AssetInfo) =>
    ratio.baseAsset.id === xAsset.id ? ratio : ratio.invertRatio();

  const getOppositeRatio = (ratio: Ratio, yAsset: AssetInfo) =>
    ratio.baseAsset.id === yAsset.id ? ratio : ratio.invertRatio();

  const handleXChange = (x: Currency | undefined) => {
    if (lastEditedField !== 'x') {
      setLastEditedField('x');
    }

    const { initialPrice, yAsset } = form.value;

    if (!x) {
      form.patchValue({ y: undefined }, { emitEvent: 'silent' });
      return;
    }
    if (!initialPrice) {
      form.patchValue({ y: undefined }, { emitEvent: 'silent' });
      return;
    }

    const ratio: Ratio =
      initialPrice.baseAsset.id === x?.asset.id
        ? getOppositeRatio(initialPrice, yAsset)
        : getMainRatio(initialPrice, x?.asset);

    form.patchValue(
      {
        y: ratio.toCurrency(x),
      },
      { emitEvent: 'silent' },
    );
  };

  const handleYChange = (y: Currency | undefined) => {
    if (lastEditedField !== 'y') {
      setLastEditedField('y');
    }

    const { initialPrice, xAsset } = form.value;

    if (!y) {
      form.patchValue({ x: undefined }, { emitEvent: 'silent' });
      return;
    }
    if (!initialPrice) {
      form.patchValue({ x: undefined }, { emitEvent: 'silent' });
      return;
    }

    const ratio: Ratio =
      initialPrice.baseAsset.id === y?.asset.id
        ? getMainRatio(initialPrice, y?.asset)
        : getOppositeRatio(initialPrice, xAsset);

    form.patchValue(
      {
        x: ratio.toCurrency(y),
      },
      { emitEvent: 'silent' },
    );
  };

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

  return (
    <OperationForm form={form} onSubmit={() => {}} actionCaption="test">
      <Flex col>
        <Flex.Item marginBottom={4}>
          <Section title="Choose a fee" tooltip="test">
            <Form.Item name="fee">
              {({ value, onChange }) => (
                <FeeSelector value={value} onChange={onChange} />
              )}
            </Form.Item>
          </Section>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Section title="Set initial price" tooltip="test">
            <Form.Item name="initialPrice">
              {({ value, onChange }) => (
                <InitialPriceInput
                  xAsset={xAsset}
                  yAsset={yAsset}
                  onChange={onChange}
                  value={value}
                />
              )}
            </Form.Item>
          </Section>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Section title="Liquidity">
            <Flex col>
              <Flex.Item marginBottom={1}>
                <TokenControlFormItem
                  tokenName="xAsset"
                  amountName="x"
                  readonly="asset"
                />
              </Flex.Item>
              <TokenControlFormItem
                tokenName="yAsset"
                amountName="y"
                readonly="asset"
              />
            </Flex>
          </Section>
        </Flex.Item>
        <Flex.Item justify="center">
          <Flex.Item flex={1} marginRight={2}>
            <Form.Listener>
              {({ value }) => (
                <RatioBox
                  mainAsset={value.xAsset}
                  oppositeAsset={value.yAsset}
                  ratio={
                    value.initialPrice
                      ? getMainRatio(value.initialPrice, value.xAsset)
                      : undefined
                  }
                />
              )}
            </Form.Listener>
          </Flex.Item>
          <Flex.Item flex={1}>
            <Form.Listener>
              {({ value }) => (
                <RatioBox
                  mainAsset={value.yAsset}
                  oppositeAsset={value.xAsset}
                  ratio={
                    value.initialPrice
                      ? getOppositeRatio(value.initialPrice, value.yAsset)
                      : undefined
                  }
                />
              )}
            </Form.Listener>
          </Flex.Item>
        </Flex.Item>
      </Flex>
    </OperationForm>
  );
};
